import { FastifyInstance } from 'fastify';
import { c as createTar } from 'tar';
import { $ } from 'zx';

import { task_item } from '@automa/prisma';

import { logger, SeverityNumber } from '../../telemetry';

import { caller } from '../../clients/github';

export default async function (app: FastifyInstance) {
  app.post<{
    Body: {
      task: {
        id: number;
        token: string;
      };
    };
  }>('/download', async (request, reply) => {
    const { id, token } = request.body.task;

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
          task_id: id,
        },
      });

      return reply.forbidden(
        'Task is older than 7 days and thus cannot be worked upon anymore',
      );
    }

    // Get repository task item
    const repoTaskItem = task.task_items.find(
      (item) => item.type === task_item.repo,
    );

    if (!repoTaskItem) {
      logger.emit({
        severityNumber: SeverityNumber.ERROR,
        body: 'Unable to find repo task item',
        attributes: {
          task_id: id,
        },
      });

      throw new Error('Unable to find repo task item when downloading code');
    }

    const { repoId } = repoTaskItem.data as { repoId: number };

    // Get repository and check if everything is in order
    const repo = await app.prisma.repos.findFirst({
      where: {
        id: repoId,
      },
      include: {
        orgs: true,
      },
    });

    if (!repo) {
      return reply.notFound('Repository not found');
    }

    if (!repo.orgs.github_installation_id) {
      return reply.notFound(
        'Automa has not been installed for the organization',
      );
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

    // Get bot task item
    const botTaskItem = task.task_items.find(
      (item) => item.type === task_item.bot,
    );

    if (!botTaskItem) {
      logger.emit({
        severityNumber: SeverityNumber.ERROR,
        body: 'Unable to find bot task item',
        attributes: {
          task_id: id,
        },
      });

      throw new Error('Unable to find bot task item when downloading code');
    }

    const { botId } = botTaskItem.data as { botId: number };

    // Get bot and check if everything is in order
    const bot = await app.prisma.bots.findFirst({
      where: {
        id: botId,
      },
    });

    if (!bot) {
      return reply.notFound('Bot not found');
    }

    // Download the code
    const { accessToken } = await caller(repo.orgs.github_installation_id);

    const workingDir = `/tmp/automa/download/tasks/${id}`;

    // Clone the repository
    await $`rm -rf ${workingDir}`;
    await $`git clone --filter=tree:0 --no-checkout --depth=1 https://x-access-token:${accessToken}@github.com/${repo.orgs.provider_name}/${repo.name} ${workingDir}`;

    // Checkout the specified paths
    if (bot.paths.length) {
      await $({
        cwd: workingDir,
      })`git sparse-checkout set --no-cone .gitignore ${bot.paths.join(' ')}`;
    }

    await $({ cwd: workingDir })`git checkout`;

    // Refresh the .git directory
    await $({ cwd: workingDir })`rm -rf .git`;
    await $({ cwd: workingDir })`git init`;
    await $({ cwd: workingDir })`git add .`;
    await $({ cwd: workingDir })`git commit --allow-empty -m "Downloaded code"`;

    // Create a ZIP archive and stream it as a response
    reply.header('Content-Type', 'application/gzip');

    const tar = createTar(
      {
        gzip: true,
        cwd: workingDir,
      },
      ['.'],
    );

    return reply.send(tar);
  });
}
