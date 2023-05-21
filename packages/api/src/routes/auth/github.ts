import crypto from 'crypto';
import { FastifyInstance } from 'fastify';

import { env } from '../../env';

export default async function (app: FastifyInstance) {
  app.get<{
    Querystring: {
      code: string;
      from: string;
    };
  }>('/github', async (request, reply) => {
    const { GITHUB_APP, API_URI } = env;

    const state = crypto.randomUUID();

    request.session.referer = request.query.from;
    request.session.githubOauthState = state;

    reply.redirect(
      `${GITHUB_APP.AUTHORIZE_URL}?client_id=${GITHUB_APP.CLIENT_ID}&redirect_uri=${API_URI}${GITHUB_APP.CALLBACK_URI}&state=${state}`,
    );
  });
}
