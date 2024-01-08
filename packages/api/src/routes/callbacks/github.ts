import { FastifyInstance } from 'fastify';
import axios from 'axios';

import { ErrorType } from '@automa/common';

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

    if (request.session.githubOauthState !== state) {
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
      data: { id, email, name },
    } = await axios.get<{
      id: number;
      email: string;
      name: string;
    }>(`${GITHUB_APP.API_URI}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check if user exists
    let user = await app.prisma.users.findFirst({
      where: {
        email,
      },
    });

    // Check if provider exists
    let provider = await app.prisma.user_providers.findFirst({
      where: {
        provider_type: 'github',
        provider_id: `${id}`,
      },
    });

    if (request.user) {
      if (request.user && user && user.id !== request.user.id) {
        return replyError(ErrorType.ACCOUNT_WITH_EMAIL_EXISTS);
      }

      if (provider && provider.user_id !== request.user.id) {
        return replyError(ErrorType.PROVIDER_ALREADY_LINKED);
      }

      user = request.user;
    } else {
      if (user && provider && provider.user_id !== user.id) {
        // User must have had multiple accounts with different emails
        // linked to different providers and must have updated their
        // email in one of the provider
        user = await app.prisma.users.findFirst({
          where: {
            id: provider.user_id,
          },
        });
      }

      if (!user) {
        user = await app.prisma.users.create({
          data: {
            name,
            email,
          },
        });
      }
    }

    if (!provider) {
      provider = await app.prisma.user_providers.create({
        data: {
          user_id: user.id,
          provider_type: 'github',
          provider_id: `${id}`,
          provider_email: email,
          refresh_token: refreshToken,
        },
      });
    }

    // Update the data in the provider
    await app.prisma.user_providers.update({
      where: {
        id: provider.id,
      },
      data: {
        provider_email: email,
        refresh_token: refreshToken,
      },
    });

    // Login the user linked to the existing/created provider
    request.session.userId = provider.user_id;
    request.session.githubAccessToken = accessToken;

    // Sync the user's data
    await sync(app, request, user);

    return reply.redirect(referer);
  });
}
