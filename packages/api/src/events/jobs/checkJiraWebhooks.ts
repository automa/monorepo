import axios, { AxiosError } from 'axios';

import { integration } from '@automa/prisma';

import { env } from '../../env';

import { JobDefinition } from '../types';

import { withJiraTokenRefresh } from '../../integrations';

const PAGE_SIZE = 5;

// Jira doesn't notify us if the user is deactivated or the app is uninstalled.
// But we don't seem to get any webhooks after that happens. Therefore, we don't
// need to delete the webhooks ourselves, but we need to constantly check if the
// connection is still valid and delete it if invalid.
const checkJiraWebhooks: JobDefinition<object> = {
  repeat: {
    pattern: '0 0 * * *',
  },
  handler: async (app, {}) => {
    const { JIRA_APP } = env;

    let cursor: number | undefined;
    let hasMore = true;

    while (hasMore) {
      const connections = await app.prisma.integrations.findMany({
        ...(cursor && {
          cursor: {
            id: cursor,
          },
          skip: 1,
        }),
        take: PAGE_SIZE,
        where: {
          type: integration.jira,
        },
        orderBy: {
          id: 'asc',
        },
      });

      await Promise.all(
        connections.map(async (connection) => {
          // Read JSON fields
          if (
            !(
              connection?.secrets &&
              typeof connection.secrets === 'object' &&
              !Array.isArray(connection.secrets)
            ) ||
            !(
              connection?.config &&
              typeof connection.config === 'object' &&
              !Array.isArray(connection.config)
            )
          ) {
            return;
          }

          const deleteIntegration = (msg: string) => {
            app.log.info(
              {
                integrationId: connection.id,
              },
              `${msg}, deleting integration`,
            );

            return app.prisma.integrations.delete({
              where: {
                id: connection.id,
              },
            });
          };

          // Delete integration if we don't have tokens
          if (
            !connection.secrets.refresh_token ||
            !connection.secrets.access_token
          ) {
            return deleteIntegration('Unable to find Jira tokens');
          }

          const webhookUrl = `${JIRA_APP.API_URI}/${connection.config.id}/rest/api/3/webhook`;

          try {
            const {
              result: { data },
            } = await withJiraTokenRefresh(
              app,
              connection.id,
              {
                access_token: connection.secrets.access_token as string,
                refresh_token: connection.secrets.refresh_token as string,
              },
              (token: string) =>
                axios.get<{
                  values: { id: number }[];
                }>(webhookUrl, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }),
            );

            // Check if the webhook still exists
            const webhookId = connection.config.webhookId as number;

            if (!data.values.some((w) => w.id === webhookId)) {
              return deleteIntegration('Unable to find Jira webhook');
            }
          } catch (e) {
            if (
              [401, 403].includes((e as AxiosError)?.response?.status as number)
            ) {
              return deleteIntegration('Unable to call Jira API');
            }

            // Unknown error, log it
            app.error.capture(e);
          }

          return;
        }),
      );

      cursor = connections[PAGE_SIZE - 1]?.id;
      hasMore = connections.length === PAGE_SIZE;
    }
  },
};

export default checkJiraWebhooks;
