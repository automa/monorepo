import { FastifyInstance } from 'fastify';
import axios from 'axios';

import { ErrorType } from '@automa/common';
import { integration } from '@automa/prisma';

import { env } from '../../env';

export default async function (app: FastifyInstance) {
  app.get<{
    Querystring: {
      code: string;
      state: string;
    };
  }>('/jira', async (request, reply) => {
    const { JIRA_APP, BASE_URI, CLIENT_URI, WEBHOOK_URI } = env;

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

    const registerWebhook = () =>
      axios.post<{
        webhookRegistrationResult: (
          | {
              createdWebhookId: number;
            }
          | {
              errors: string[];
            }
        )[];
      }>(
        `${JIRA_APP.API_URI}/${jiraOrg.id}/rest/api/3/webhook`,
        {
          url: `${WEBHOOK_URI ?? BASE_URI}/hooks/jira`,
          webhooks: [
            {
              events: ['comment_created', 'comment_updated'],
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

    let data;

    try {
      ({
        data: {
          webhookRegistrationResult: [data],
        },
      } = await registerWebhook());

      // Check for errors for webhook registration
      if ('errors' in data) {
        if (
          data.errors[0].startsWith('A maximum') ||
          data.errors[0].startsWith('Only a single URL')
        ) {
          // Get all webhooks for the app
          const {
            data: { values: webhooks },
          } = await axios.get<{
            values: {
              id: number;
            }[];
          }>(`${JIRA_APP.API_URI}/${jiraOrg.id}/rest/api/3/webhook`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          // Delete first 5 webhooks for the app
          await axios.request({
            method: 'DELETE',
            url: `${JIRA_APP.API_URI}/${jiraOrg.id}/rest/api/3/webhook`,
            data: {
              webhookIds: webhooks.slice(0, 5).map(({ id }) => id),
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          // Retry registering the webhook
          ({
            data: {
              webhookRegistrationResult: [data],
            },
          } = await registerWebhook());

          // Check for errors for webhook registration retry
          if ('errors' in data) {
            throw data.errors;
          }
        }
        // If unknown error, throw it to log it
        else {
          throw data.errors;
        }
      }
    } catch (error: any) {
      app.log.error({ error }, 'Unable to register Jira webhook');

      return replyError(ErrorType.UNABLE_TO_REGISTER_JIRA_WEBHOOK);
    }

    // Save integration along with jira webhook information
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
          webhookId: data.createdWebhookId,
          userEmail: jiraUser.emailAddress,
          refreshedAt: new Date(),
        },
        created_by: request.userId!,
      },
    });

    return reply.redirect(referer);
  });
}
