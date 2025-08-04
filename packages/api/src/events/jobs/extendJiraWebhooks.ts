import axios from 'axios';

import { integration } from '@automa/prisma';

import { env } from '../../env';

import { JobDefinition } from '../types';

import { withJiraTokenRefresh } from '../../integrations';

const PAGE_SIZE = 5;

const extendJiraWebhooks: JobDefinition<object> = {
  repeat: {
    pattern: '0 1 * * *',
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

          // Check if the webhook is close to expiring
          const refreshedAt = connection.config.refreshedAt as string;

          if (
            Date.now() - 1000 * 60 * 60 * 24 * 27 <
            new Date(refreshedAt).getTime()
          ) {
            return;
          }

          // Check if we have tokens
          if (
            !connection.secrets.refresh_token ||
            !connection.secrets.access_token
          ) {
            return;
          }

          const refreshUrl = `${JIRA_APP.API_URI}/${connection.config.id}/rest/api/3/webhook/refresh`;
          const webhookId = connection.config.webhookId as number;

          await withJiraTokenRefresh(
            app,
            connection.id,
            {
              access_token: connection.secrets.access_token as string,
              refresh_token: connection.secrets.refresh_token as string,
            },
            (token: string) =>
              axios.put(
                refreshUrl,
                {
                  webhookIds: [webhookId],
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              ),
          );

          // Update the integration with the new expiration date
          await app.prisma.integrations.update({
            where: {
              id: connection.id,
            },
            data: {
              config: {
                ...connection.config,
                refreshedAt: new Date(),
              },
            },
          });
        }),
      );

      cursor = connections[PAGE_SIZE - 1]?.id;
      hasMore = connections.length === PAGE_SIZE;
    }
  },
};

export default extendJiraWebhooks;
