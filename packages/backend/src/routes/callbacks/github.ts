import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import axios from 'axios';

import { users } from '@automa/prisma';

export default async function (app: FastifyInstance) {
  const createProvider = async (
    user: users,
    refreshToken: string,
    { id, email }: { id: number; email: string },
  ) => {
    return app.prisma.user_providers.create({
      data: {
        user_id: user.id,
        provider_type: 'github',
        provider_id: `${id}`,
        provider_email: email,
        refresh_token: refreshToken,
      },
    });
  };

  const replyError = (
    request: FastifyRequest,
    reply: FastifyReply,
    code: number,
  ) => {
    return reply.redirect(`${request.session.referer}?error=${code}`);
  };

  app.get<{
    Querystring: {
      code: string;
      state: string;
    };
  }>('/github', async (request, reply) => {
    const { code, state } = request.query;

    if (!code || !state) {
      return reply.badRequest();
    }

    if (request.session.githubOauthState !== state) {
      return reply.unauthorized();
    }

    const {
      config: { GITHUB_APP, CLIENT_URI },
    } = app;

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
        code,
      },
      {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      },
    );

    if (!refreshToken || !accessToken) {
      return replyError(request, reply, 1002);
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
        return replyError(request, reply, 1000);
      }

      if (provider && provider.user_id !== request.user.id) {
        return replyError(request, reply, 1001);
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
      provider = await createProvider(user, refreshToken, {
        id,
        email,
      });
    }

    // Update the data in the provider
    if (
      provider.refresh_token !== refreshToken ||
      provider.provider_email !== email
    ) {
      await app.prisma.user_providers.update({
        where: {
          id: provider.id,
        },
        data: {
          provider_email: email,
          refresh_token: refreshToken,
        },
      });
    }

    // Login the user linked to the existing/created provider
    request.session.userId = provider.user_id;
    request.session.githubAccessToken = accessToken;

    reply.redirect(request.session.referer || CLIENT_URI);
  });
}
