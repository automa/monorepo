import { FastifyInstance } from 'fastify';
import axios from 'axios';

import { ErrorType } from '@automa/common';
import { integration } from '@automa/prisma';

import { env, isProduction, isTest } from '../../env';

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
    const { data: jiraOrgs } = await axios.get<
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

    if (jiraOrgs.length !== 1) {
      // TODO: Need to allow user to select site
      return replyError(ErrorType.MULTIPLE_JIRA_SITES_FOR_USER_NOT_SUPPORTED);
    }

    const jiraOrg = jiraOrgs[0];

    const { data: jiraUser } = await axios.get<{
      accountId: string;
      displayName: string;
      emailAddress: string;
    }>(`${JIRA_APP.API_URI}/${jiraOrg.id}/rest/api/3/myself`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!jiraUser?.emailAddress) {
      return replyError(ErrorType.UNABLE_TO_READ_JIRA_USER);
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
      `${JIRA_APP.API_URI}/${jiraOrg.id}/rest/api/3/webhook`,
      {
        url: `${
          isTest || isProduction ? BASE_URI : 'https://automa.eu.ngrok.io'
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

    // Jira doesn't notify us if the user is deactivated or the app is uninstalled.
    // But we don't seem to get any webhooks after that happens. Therefore, we don't
    // need to delete the webhooks ourselves, but we need to constantly check if the
    // connection is still valid and delete it if invalid.
    // TODO: Add a job to check the connection and delete if invalid
    await app.prisma.integrations.create({
      data: {
        org_id: org.id,
        type: integration.jira,
        secrets: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
        config: {
          id: jiraOrg.id,
          url: jiraOrg.url,
          name: jiraOrg.name,
          scopes: jiraOrg.scopes,
          webhookId: webhook.createdWebhookId,
          userEmail: jiraUser.emailAddress,
        },
        created_by: request.userId!,
      },
    });

    return reply.redirect(referer);
  });
}
