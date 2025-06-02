import { JobDefinition } from '../types';
import { chunkArray } from '../utils';

const PAGE_SIZE = 100;
const CHUNK_SIZE = 10;

const scheduleBotInstallation: JobDefinition<{
  botId: number;
  orgId: number;
  timestamp: number;
}> = {
  handler: async (app, { botId, orgId, timestamp }) => {
    let cursor: number | undefined;
    let hasMore = true;

    while (hasMore) {
      const repos = await app.prisma.repos.findMany({
        ...(cursor && {
          cursor: {
            id: cursor,
          },
          skip: 1,
        }),
        take: PAGE_SIZE,
        where: {
          org_id: orgId,
        },
        orderBy: {
          id: 'asc',
        },
      });

      await Promise.all(
        chunkArray(
          repos.filter((repo) => repo.has_installation && !repo.is_archived),
          CHUNK_SIZE,
        ).map((repos) =>
          app.events.scheduleTask.bulkPublish(
            repos.map((repo) => ({
              id: `${botId}-${orgId}-${repo.id}-${timestamp}`,
              input: {
                botId,
                orgId,
                repoId: repo.id,
              },
            })),
          ),
        ),
      );

      cursor = repos[PAGE_SIZE - 1]?.id;
      hasMore = repos.length === PAGE_SIZE;
    }
  },
};

export default scheduleBotInstallation;
