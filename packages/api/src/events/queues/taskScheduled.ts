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
      body: `Processing task scheduled event`,
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
      task_items: {
        create: [
          {
            type: task_item.repo,
            data: {
              repoId: repo.id,
              repoName: repo.name,
              repoOrgId: repo.orgs.id,
              repoOrgName: repo.orgs.name,
              repoOrgProviderType: repo.orgs.provider_type,
              repoOrgProviderId: repo.orgs.provider_id,
              repoProviderId: repo.provider_id,
            },
          },
          {
            type: task_item.bot,
            data: {
              botId: bot.id,
              botName: bot.name,
              botImageUrl: bot.image_url,
              botOrgId: bot.orgs.id,
              botOrgName: bot.orgs.name,
            },
          },
        ],
      },
    });
  },
};

export default taskScheduled;
