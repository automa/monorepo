import { FastifyInstance, FastifyReply } from 'fastify';

import { bots, orgs, task_item, task_items, tasks } from '@automa/prisma';

export const getTask = async (
  app: FastifyInstance,
  reply: FastifyReply,
  body: { id: number; token: string },
): Promise<(tasks & { task_items: task_items[] }) | void> => {
  const { id, token } = body;

  const task = await app.prisma.tasks.findFirst({
    where: {
      id,
      token,
    },
    include: {
      task_items: true,
    },
  });

  if (!task) {
    return reply.notFound('Task not found');
  }

  // TODO: Remove this restriction
  // If task was created more than 1 week ago, we return 403
  if (task.created_at.getTime() < Date.now() - 1000 * 60 * 60 * 24 * 7) {
    app.log.warn({ task_id: body.id }, 'Task is too old');

    return reply.forbidden(
      'Task is older than a week and thus cannot be worked upon anymore',
    );
  }

  return task;
};

export const getRepo = async (
  app: FastifyInstance,
  reply: FastifyReply,
  task: tasks & { task_items: task_items[] },
) => {
  const repoTaskItem = task.task_items.find(
    (item) => item.type === task_item.repo,
  );

  if (!repoTaskItem) {
    app.log.error({ task_id: task.id }, 'Unable to find repo task item');

    throw new Error('Unable to find repo task item when downloading code');
  }

  const repoId = repoTaskItem.repo_id;

  if (!repoId) {
    return reply.notFound('Repository not found');
  }

  // Get repository and check if everything is in order
  const repo = await app.prisma.repos.findFirstOrThrow({
    where: {
      id: repoId,
    },
    include: {
      orgs: true,
    },
  });

  if (!repo.orgs.github_installation_id) {
    return reply.notFound('Automa has not been installed for the organization');
  }

  if (!repo.orgs.has_installation) {
    return reply.notFound('Automa has been suspended for the organization');
  }

  if (repo.is_archived) {
    return reply.notFound('Repository is archived');
  }

  if (!repo.has_installation) {
    return reply.notFound('Automa has not been installed for the repository');
  }

  return repo;
};

export const getBot = async (
  app: FastifyInstance,
  reply: FastifyReply,
  task: tasks & { task_items: task_items[] },
): Promise<(bots & { orgs: Pick<orgs, 'name'> }) | void> => {
  const botTaskItem = task.task_items.find(
    (item) => item.type === task_item.bot,
  );

  if (!botTaskItem) {
    app.log.error({ task_id: task.id }, 'Unable to find bot task item');

    throw new Error('Unable to find bot task item when downloading code');
  }

  const botId = botTaskItem.bot_id;

  if (!botId) {
    return reply.notFound('Bot not found');
  }

  // Get bot and check if everything is in order
  const bot = await app.prisma.bots.findFirstOrThrow({
    where: {
      id: botId,
    },
    include: {
      orgs: {
        select: {
          name: true,
        },
      },
    },
  });

  return bot;
};
