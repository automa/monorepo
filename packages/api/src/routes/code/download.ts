import { FastifyInstance } from 'fastify';
import { c as createTar } from 'tar';
import { $ } from 'zx';

import { caller } from '../../clients/github';

import { getBot, getRepo, getTask } from './utils';

export default async function (app: FastifyInstance) {
  app.post<{
    Body: {
      task: {
        id: number;
        token: string;
      };
    };
  }>('/download', async (request, reply) => {
    const task = await getTask(app, reply, request.body.task);

    if (!task) {
      return;
    }

    const repo = await getRepo(app, reply, task);

    if (!repo) {
      return;
    }

    const bot = await getBot(app, reply, task);

    if (!bot) {
      return;
    }

    const { accessToken } = await caller(repo.orgs.github_installation_id!);
    const workingDir = `/tmp/automa/download/tasks/${task.id}`;

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

    // Create an archive and stream it as a response
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
