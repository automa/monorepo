import { bot } from '@automa/prisma';

import { JobDefinition } from '../types';
import { chunkArray } from '../utils';

const PAGE_SIZE = 100;
const CHUNK_SIZE = 10;

const scheduleBots: JobDefinition<object> = {
  repeat: {
    pattern: '0 0 * * 1',
  },
  handler: async (app, {}) => {
    let cursor: number | undefined;
    let hasMore = true;
    const timestamp = Date.now();

    while (hasMore) {
      const bots = await app.prisma.bots.findMany({
        ...(cursor && {
          cursor: {
            id: cursor,
          },
          skip: 1,
        }),
        take: PAGE_SIZE,
        where: {
          type: bot.scheduled,
        },
        orderBy: {
          id: 'asc',
        },
      });

      await Promise.all(
        chunkArray(bots, CHUNK_SIZE).map((bots) =>
          app.events.scheduleBot.bulkPublish(
            bots.map((bot) => ({
              id: `${bot.id}-${timestamp}`,
              input: {
                botId: bot.id,
                timestamp,
              },
            })),
          ),
        ),
      );

      cursor = bots[PAGE_SIZE - 1]?.id;
      hasMore = bots.length === PAGE_SIZE;
    }
  },
};

export default scheduleBots;
