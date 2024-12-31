import { bot } from '@automa/prisma';

import { logger, SeverityNumber } from '../../telemetry';

import { JobDefinition } from '../types';

const PAGE_SIZE = 10;

const botScheduleTriggered: JobDefinition<object> = {
  repeat: {
    pattern: '0 0 * * 1',
  },
  handler: async (app, {}) => {
    logger.emit({
      severityNumber: SeverityNumber.INFO,
      body: 'Processing bot schedule job',
    });

    let cursor: number | undefined;
    let hasMore = true;

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
        bots.map((bot) =>
          app.events.botScheduled.publish(bot.id, {
            botId: bot.id,
          }),
        ),
      );

      cursor = bots[PAGE_SIZE - 1]?.id;
      hasMore = bots.length === PAGE_SIZE;
    }
  },
};

export default botScheduleTriggered;
