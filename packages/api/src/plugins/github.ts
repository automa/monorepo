import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import axios, { AxiosError, Method } from 'axios';

import { env } from '../env';

declare module 'fastify' {
  interface FastifyRequest {
    github: <ReponseBody>(options: {
      path: string;
      method?: Method;
      data?: any;
    }) => Promise<ReponseBody>;
  }
}

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'Automa App',
  'X-GitHub-Api-Version': '2022-11-28',
};

const githubPlugin: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (request, reply) => {
    request.github = async ({ path, method = 'GET', data = undefined }) => {
      const call = (accessToken: string) =>
        axios({
          url: `${env.GITHUB_APP.API_URI}${path}`,
          method,
          data,
          headers: {
            ...headers,
            Authorization: `Bearer ${accessToken}`,
          },
        });

      const { githubAccessToken } = request.session;

      if (!request.session.userId || !githubAccessToken) {
        return reply.unauthorized();
      }

      try {
        const result = await call(githubAccessToken);

        return result.data;
      } catch (err) {
        if (
          !(err instanceof AxiosError) ||
          err.response?.status !== 401 ||
          err.response?.data?.message !== 'Bad credentials'
        ) {
          throw err;
        }
      }

      // Get user's refresh token from db
      const userProvider = await app.prisma.user_providers.findFirstOrThrow({
        where: {
          user_id: request.session.userId,
          provider_type: 'github',
        },
      });

      // Get new access token
      const tokens = await axios.post(
        env.GITHUB_APP.ACCESS_TOKEN_URL,
        {
          client_id: env.GITHUB_APP.CLIENT_ID,
          client_secret: env.GITHUB_APP.CLIENT_SECRET,
          refresh_token: userProvider.refresh_token,
          grant_type: 'refresh_token',
        },
        {
          headers,
        },
      );

      if (!tokens.data.access_token) {
        throw new Error(`No access token. ${JSON.stringify(tokens.data)}`);
      }

      await app.prisma.user_providers.update({
        where: {
          id: userProvider.id,
        },
        data: {
          refresh_token: tokens.data.refresh_token,
        },
      });

      const accessToken = tokens.data.access_token;
      const result = await call(accessToken);

      request.session.githubAccessToken = accessToken;

      return result.data;
    };
  });
};

export default fp(githubPlugin, {
  name: 'github',
});
