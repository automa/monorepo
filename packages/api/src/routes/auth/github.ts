import { randomUUID } from 'node:crypto';
import { URLSearchParams } from 'node:url';

import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { env } from '../../env';

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/github',
    {
      schema: {
        querystring: z.object({
          from: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { GITHUB_APP, BASE_URI } = env;

      const state = randomUUID();

      request.session.referer = request.query.from;
      request.session.integrationOauthState = state;

      const params = new URLSearchParams();

      params.append('client_id', GITHUB_APP.CLIENT_ID);
      params.append('redirect_uri', `${BASE_URI}${GITHUB_APP.CALLBACK_URI}`);
      params.append('state', state);

      return reply.redirect(`${GITHUB_APP.AUTHORIZE_URL}?${params.toString()}`);
    },
  );
}
