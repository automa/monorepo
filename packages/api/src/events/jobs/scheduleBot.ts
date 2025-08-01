import { JobDefinition } from '../types';
import { chunkArray } from '../utils';

const PAGE_SIZE = 100;
const CHUNK_SIZE = 10;

const scheduleBot: JobDefinition<{
  botId: number;
  timestamp: number;
}> = {
  handler: async (app, { botId, timestamp }) => {
    let cursor: number | undefined;
    let hasMore = true;

    while (hasMore) {
      const botInstallations = await app.prisma.bot_installations.findMany({
        ...(cursor && {
          cursor: {
            id: cursor,
          },
          skip: 1,
        }),
        take: PAGE_SIZE,
        where: {
          bot_id: botId,
        },
        include: {
          orgs: {
            select: {
              has_installation: true,
            },
          },
        },
        orderBy: {
          id: 'asc',
        },
      });

      await Promise.all(
        chunkArray(
          botInstallations.filter(
            (botInstallation) => botInstallation.orgs.has_installation,
          ),
          CHUNK_SIZE,
        ).map((botInstallations) =>
          app.events.scheduleBotInstallation.bulkPublish(
            botInstallations.map((botInstallation) => ({
              id: `${botId}-${botInstallation.org_id}-${timestamp}`,
              input: {
                botId,
                orgId: botInstallation.org_id,
                timestamp,
              },
            })),
          ),
        ),
      );

      cursor = botInstallations[PAGE_SIZE - 1]?.id;
      hasMore = botInstallations.length === PAGE_SIZE;
    }
  },
};

export default scheduleBot;
