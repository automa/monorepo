import { task_item, task_state } from '@automa/prisma';

import { JobDefinition } from '../types';

import { taskCreate } from '../../db';

const scheduleTask: JobDefinition<{
  botId: number;
  orgId: number;
  repoId: number;
}> = {
  handler: async (app, { botId, orgId, repoId }) => {
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

    const hasTask = await app.prisma.tasks.count({
      where: {
        org_id: orgId,
        state: {
          in: [task_state.submitted, task_state.started],
        },
        task_items: {
          some: {
            type: task_item.repo,
            repo_id: repo.id,
          },
        },
        AND: {
          task_items: {
            some: {
              type: task_item.bot,
              bot_id: bot.id,
            },
          },
        },
      },
    });

    if (hasTask > 0) {
      app.log.info(
        `The previous task for ${bot.orgs.name}/${bot.name} on ${repo.name} is still waiting, skipping scheduling a new task.`,
      );

      return;
    }

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

export default scheduleTask;
