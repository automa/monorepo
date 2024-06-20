import { FastifyInstance } from 'fastify';
import axios from 'axios';

import { ErrorType } from '@automa/common';
import { provider } from '@automa/prisma';

import { env } from '../../env';

import { sync } from '../../clients/github';

export default async function (app: FastifyInstance) {
  app.get<{
    Querystring: {
      code: string;
      state: string;
    };
  }>('/github', async (request, reply) => {
    const { GITHUB_APP, BASE_URI, CLIENT_URI } = env;

    const referer = request.session.referer || CLIENT_URI;

    const replyError = (code: number) =>
      reply.redirect(`${referer}?error=${code}`);

    const { code, state } = request.query;

    if (!code || !state) {
      return replyError(ErrorType.UNABLE_TO_LOGIN_WITH_PROVIDER);
    }

    if (request.session.integrationOauthState !== state) {
      return replyError(ErrorType.UNABLE_TO_LOGIN_WITH_PROVIDER);
    }

    const {
      data: { access_token: accessToken, refresh_token: refreshToken },
    } = await axios.post<{
      access_token: string;
      refresh_token: string;
    }>(
      GITHUB_APP.ACCESS_TOKEN_URL,
      {
        client_id: GITHUB_APP.CLIENT_ID,
        client_secret: GITHUB_APP.CLIENT_SECRET,
        redirect_uri: `${BASE_URI}${GITHUB_APP.CALLBACK_URI}`,
        code,
      },
      {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      },
    );

    if (!refreshToken || !accessToken) {
      return replyError(ErrorType.UNABLE_TO_LOGIN_WITH_PROVIDER);
    }

    // Get email & username from GitHub
    const {
      data: { id, email, name, login },
    } = await axios.get<{
      id: number;
      email: string;
      name: string;
      login: string;
    }>(`${GITHUB_APP.API_URI}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const updateProvider = (userProviderId: number) =>
      app.prisma.user_providers.update({
        where: {
          id: userProviderId,
        },
        data: {
          provider_email: email,
          refresh_token: refreshToken,
        },
      });

    const finish = async (userId: number) => {
      // Login the user linked to the existing/created provider
      request.session.userId = userId;
      request.session.githubAccessToken = accessToken;

      // Sync the user's organizations
      await sync(app, request, userId, { id, login });

      return reply.redirect(referer);
    };

    // Check if provider exists
    const existingProvider = await app.prisma.user_providers.findFirst({
      where: {
        provider_type: provider.github,
        provider_id: `${id}`,
      },
    });

    // Update the provider data if it exists and return
    if (existingProvider) {
      await updateProvider(existingProvider.id);
      return finish(existingProvider.user_id);
    }

    // Check if user exists
    let user = await app.prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      if (request.userId) {
        user = await app.prisma.users.findUniqueOrThrow({
          where: {
            id: request.userId,
          },
        });
      } else {
        user = await app.prisma.users.create({
          data: {
            name,
            email,
          },
        });
      }
    }

    // Check if provider exists for the user
    let userProvider = await app.prisma.user_providers.findFirst({
      where: {
        user_id: user.id,
        provider_type: provider.github,
      },
    });

    if (userProvider && userProvider.provider_id !== `${id}`) {
      return replyError(ErrorType.PROVIDER_ALREADY_LINKED);
    }

    // Create a provider since it won't exist at this point because
    // if it did, we would have already returned at the `existingProvider` check
    userProvider = await app.prisma.user_providers.create({
      data: {
        user_id: user.id,
        provider_type: provider.github,
        provider_id: `${id}`,
        provider_email: email,
        refresh_token: refreshToken,
      },
    });

    return finish(user.id);
  });
}
