import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import axios, { AxiosError, AxiosResponse, Method } from 'axios';

import { provider } from '@automa/prisma';

import { env } from '../env';
import { nextLinkHeader } from '../clients/utils';
import { createCallers, headers } from '../clients/github';

declare module 'fastify' {
  interface FastifyRequest {
    github: {
      axios: <ReponseBody>(options: {
        path: string;
        method?: Method;
        data?: any;
      }) => Promise<ReponseBody>;
      paginate: <ResponseBody>(
        path: string,
      ) => AsyncGenerator<ResponseBody, void, unknown>;
    };
  }
}

const githubPlugin: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (request, reply) => {
    const runWithToken = async <T>(fn: (accessToken: string) => Promise<T>) => {
      const { githubAccessToken } = request.session;

      // TODO: Need to fix this when supporting other providers
      if (!request.session.userId || !githubAccessToken) {
        return reply.unauthorized();
      }

      try {
        // We need to call the function first to catch the error before we return the result
        return await fn(githubAccessToken);
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
          provider_type: provider.github,
        },
      });

      // If no refresh token, return unauthorized
      if (!userProvider.refresh_token) {
        return reply.unauthorized();
      }

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

      // If either the app has been revoked or if the refresh token is expired
      if (tokens.data.error === 'bad_refresh_token') {
        return reply.unauthorized();
      }

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
      const result = await fn(accessToken);

      request.session.githubAccessToken = accessToken;

      return result;
    };

    request.github = {
      axios: async ({ path, method = 'GET', data = undefined }) => {
        const result = await runWithToken<AxiosResponse<any>>(
          (accessToken: string) =>
            createCallers(accessToken).axios.request({
              url: path,
              method,
              data,
            }),
        );

        if (result) {
          return result.data;
        }
      },
      paginate: async function* (path: string) {
        let requestUrl: string | null = path;

        while (requestUrl) {
          const response = await runWithToken<AxiosResponse<any>>(
            (accessToken: string) =>
              createCallers(accessToken).axios.get(requestUrl!),
          );

          requestUrl = null;

          if (response) {
            yield response.data;
            requestUrl = nextLinkHeader(response);
          }
        }
      },
    };
  });
};

export default fp(githubPlugin, {
  name: 'github',
});
