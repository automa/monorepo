import crypto from 'crypto';
import { URLSearchParams } from 'url';
import { FastifyInstance } from 'fastify';

import { env } from '../../env';

export default async function (app: FastifyInstance) {
  app.get<{
    Querystring: {
      from?: string;
    };
  }>('/github', async (request, reply) => {
    const { GITHUB_APP, BASE_URI } = env;

    const state = crypto.randomUUID();

    request.session.referer = request.query.from;
    request.session.githubOauthState = state;

    const params = new URLSearchParams();

    params.append('client_id', GITHUB_APP.CLIENT_ID);
    params.append('redirect_uri', `${BASE_URI}${GITHUB_APP.CALLBACK_URI}`);
    params.append('state', state);

    return reply.redirect(`${GITHUB_APP.AUTHORIZE_URL}?${params.toString()}`);
  });
}
