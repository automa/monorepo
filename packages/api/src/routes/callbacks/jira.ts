import { FastifyInstance } from 'fastify';
import axios from 'axios';

import { ErrorType } from '@automa/common';
import { integration } from '@automa/prisma';

import { env, isProduction } from '../../env';

export default async function (app: FastifyInstance) {
  app.get<{
    Querystring: {
      code: string;
      state: string;
    };
  }>('/jira', async (request, reply) => {
    const { JIRA_APP, BASE_URI, CLIENT_URI } = env;

    const org = await app.prisma.orgs.findFirst({
      where: {
        id: request.session?.orgId,
      },
    });

    const referer = org ? `${CLIENT_URI}/${org.name}/integrations` : CLIENT_URI;

    const replyError = (code: number) =>
      reply.redirect(`${referer}?error=${code}`);

    const { code, state } = request.query;

    if (!org || !code || !state) {
      return replyError(ErrorType.UNABLE_TO_CONNECT_INTEGRATION);
    }

    if (request.session.integrationOauthState !== state) {
      return replyError(ErrorType.UNABLE_TO_CONNECT_INTEGRATION);
    }

    const {
      data: { access_token: accessToken, refresh_token: refreshToken },
    } = await axios.post<{
      access_token: string;
      refresh_token: string;
    }>(JIRA_APP.ACCESS_TOKEN_URL, {
      client_id: JIRA_APP.CLIENT_ID,
      client_secret: JIRA_APP.CLIENT_SECRET,
      redirect_uri: `${BASE_URI}${JIRA_APP.CALLBACK_URI}`,
      code,
      grant_type: 'authorization_code',
    });

    if (!accessToken || !refreshToken) {
      return replyError(ErrorType.UNABLE_TO_CONNECT_INTEGRATION);
    }

    // Get accessible resources
    const { data } = await axios.get<
      {
        id: string;
        url: string;
        name: string;
        scopes: string[];
      }[]
    >(JIRA_APP.ACCESSIBLE_RESOURCES_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (data.length !== 1) {
      // TODO: Need to allow user to select site
      return replyError(ErrorType.MULTIPLE_JIRA_SITES_FOR_USER_NOT_SUPPORTED);
    }

    // TODO: Rotate webhook and refresh token every 30 days
    // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-webhooks/#api-rest-api-3-webhook-refresh-put
    const {
      data: {
        webhookRegistrationResult: [webhook],
      },
    } = await axios.post<{
      webhookRegistrationResult: {
        createdWebhookId: number;
      }[];
    }>(
      `${JIRA_APP.API_URI}/${data[0].id}/rest/api/3/webhook`,
      {
        url: `${
          isProduction ? BASE_URI : 'https://automa.eu.ngrok.io'
        }/hooks/jira`,
        webhooks: [
          {
            events: ['comment_created'],
            jqlFilter: 'project != ______NON_EXISTENT_PROJECT',
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    await app.prisma.integrations.create({
      data: {
        org_id: org.id,
        integration_type: integration.jira,
        secrets: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
        config: {
          id: data[0].id,
          url: data[0].url,
          name: data[0].name,
          scopes: data[0].scopes,
          webhook_id: webhook.createdWebhookId,
        },
        created_by: request.userId!,
      },
    });

    return reply.redirect(referer);
  });
}
