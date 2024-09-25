import { randomUUID } from 'node:crypto';
import { URLSearchParams } from 'node:url';

import { FastifyInstance } from 'fastify';

import { env } from '../../../../../../env';

export default async function (app: FastifyInstance) {
  app.get('/jira', async (request, reply) => {
    const { JIRA_APP, BASE_URI } = env;

    const state = randomUUID();

    request.session.orgId = request.org?.id;
    request.session.integrationOauthState = state;

    const params = new URLSearchParams();

    params.append('client_id', JIRA_APP.CLIENT_ID);
    params.append('redirect_uri', `${BASE_URI}${JIRA_APP.CALLBACK_URI}`);
    params.append('response_type', 'code');
    params.append(
      'scope',
      [
        'read:jira-user',
        'read:jira-work',
        'write:jira-work',
        'manage:jira-webhook',
        'offline_access',
      ].join(' '),
    );
    params.append('state', state);
    params.append('prompt', 'consent');
    params.append('audience', 'api.atlassian.com');

    return reply.redirect(`${JIRA_APP.AUTHORIZE_URL}?${params.toString()}`);
  });
}
