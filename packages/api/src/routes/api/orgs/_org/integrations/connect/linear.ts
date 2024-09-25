import { randomUUID } from 'node:crypto';
import { URLSearchParams } from 'node:url';

import { FastifyInstance } from 'fastify';

import { env } from '../../../../../../env';

export default async function (app: FastifyInstance) {
  app.get('/linear', async (request, reply) => {
    const { LINEAR_APP, BASE_URI } = env;

    const state = randomUUID();

    request.session.orgId = request.org?.id;
    request.session.integrationOauthState = state;

    const params = new URLSearchParams();

    params.append('client_id', LINEAR_APP.CLIENT_ID);
    params.append('redirect_uri', `${BASE_URI}${LINEAR_APP.CALLBACK_URI}`);
    params.append('response_type', 'code');
    params.append('scope', ['read', 'comments:create'].join(','));
    params.append('state', state);
    params.append('prompt', 'consent');
    params.append('actor', 'application');

    return reply.redirect(`${LINEAR_APP.AUTHORIZE_URL}?${params.toString()}`);
  });
}
