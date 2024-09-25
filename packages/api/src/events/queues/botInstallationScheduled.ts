import { logger, SeverityNumber } from '../../telemetry';

import { QueueDefinition } from '../types';

const PAGE_SIZE = 10;

const botInstallationScheduled: QueueDefinition<{
  botId: number;
  orgId: number;
}> = {
  topic: 'bot-installation-scheduled',
  handler: async (app, { botId, orgId }) => {
    logger.emit({
      severityNumber: SeverityNumber.INFO,
      body: 'Processing bot installation scheduled event',
      attributes: {
        botId,
        orgId,
      },
    });

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
        repos
          .filter((repo) => repo.has_installation && !repo.is_archived)
          .map((repo) =>
            app.events.taskScheduled.publish({
              botId,
              orgId,
              repoId: repo.id,
            }),
          ),
      );

      cursor = repos[PAGE_SIZE - 1]?.id;
      hasMore = repos.length === PAGE_SIZE;
    }
  },
};

export default botInstallationScheduled;
