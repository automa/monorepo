import { logger, SeverityNumber } from '../../telemetry';

import { QueueDefinition } from '../types';

const PAGE_SIZE = 10;

const botScheduled: QueueDefinition<{
  botId: number;
}> = {
  topic: 'bot-scheduled',
  handler: async (app, { botId }) => {
    logger.emit({
      severityNumber: SeverityNumber.INFO,
      body: `Processing bot scheduled event`,
      attributes: {
        botId,
      },
    });

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
        botInstallations
          .filter((botInstallation) => botInstallation.orgs.has_installation)
          .map((botInstallation) =>
            app.events.botInstallationScheduled.publish({
              botId,
              orgId: botInstallation.org_id,
            }),
          ),
      );

      cursor = botInstallations[PAGE_SIZE - 1]?.id;
      hasMore = botInstallations.length === PAGE_SIZE;
    }
  },
};

export default botScheduled;
