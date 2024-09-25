import { bot } from '@automa/prisma';

import { logger, SeverityNumber } from '../../telemetry';

import { QueueDefinition } from '../types';

const PAGE_SIZE = 10;

const botScheduleJob: QueueDefinition<object> = {
  topic: 'bot-schedule-job',
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
          app.events.botScheduled.publish({
            botId: bot.id,
          }),
        ),
      );

      cursor = bots[PAGE_SIZE - 1]?.id;
      hasMore = bots.length === PAGE_SIZE;
    }
  },
};

export default botScheduleJob;
