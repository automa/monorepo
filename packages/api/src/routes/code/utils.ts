import { FastifyInstance, FastifyReply } from 'fastify';

import { task_item, task_items, tasks } from '@automa/prisma';

import { logger, SeverityNumber } from '../../telemetry';

export const getTask = async (
  app: FastifyInstance,
  reply: FastifyReply,
  body: { id: number; token: string },
) => {
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

  // If task was created more than 7 days ago, we return 403
  if (task.created_at.getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000) {
    logger.emit({
      severityNumber: SeverityNumber.WARN,
      body: 'Task is too old',
      attributes: {
        task_id: body.id,
      },
    });

    // TODO: Check for old tasks in a cron and mark them as failed
    return reply.forbidden(
      'Task is older than 7 days and thus cannot be worked upon anymore',
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
    logger.emit({
      severityNumber: SeverityNumber.ERROR,
      body: 'Unable to find repo task item',
      attributes: {
        task_id: task.id,
      },
    });

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

  if (!repo.has_installation) {
    return reply.notFound('Automa has not been installed for the repository');
  }

  if (repo.is_archived) {
    return reply.notFound('Repository is archived');
  }

  return repo;
};

export const getBot = async (
  app: FastifyInstance,
  reply: FastifyReply,
  task: tasks & { task_items: task_items[] },
) => {
  const botTaskItem = task.task_items.find(
    (item) => item.type === task_item.bot,
  );

  if (!botTaskItem) {
    logger.emit({
      severityNumber: SeverityNumber.ERROR,
      body: 'Unable to find bot task item',
      attributes: {
        task_id: task.id,
      },
    });

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
