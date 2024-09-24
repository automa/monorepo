import { task_item } from '@automa/prisma';

import { logger, SeverityNumber } from '../../telemetry';

import { QueueDefinition } from '../types';

import { taskCreate } from '../../db';

const taskScheduled: QueueDefinition<{
  botId: number;
  orgId: number;
  repoId: number;
}> = {
  topic: 'task-scheduled',
  handler: async (app, { botId, orgId, repoId }) => {
    logger.emit({
      severityNumber: SeverityNumber.INFO,
      body: 'Processing task scheduled event',
      attributes: {
        botId,
        orgId,
        repoId,
      },
    });

    const [repo, bot] = await Promise.all([
      app.prisma.repos.findUniqueOrThrow({
        where: {
          id: repoId,
        },
        include: {
          orgs: true,
        },
      }),
      app.prisma.bots.findUniqueOrThrow({
        where: {
          id: botId,
        },
        include: {
          orgs: true,
        },
      }),
    ]);

    await taskCreate(app, {
      org_id: orgId,
      title: `Running ${bot.orgs.name}/${bot.name} on ${repo.name}`,
      is_scheduled: true,
      task_items: {
        create: [
          {
            type: task_item.repo,
            repo_id: repo.id,
          },
          {
            type: task_item.bot,
            bot_id: bot.id,
          },
        ],
      },
    });
  },
};

export default taskScheduled;
