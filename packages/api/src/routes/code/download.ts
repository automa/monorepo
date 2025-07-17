import { randomBytes } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';

import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { c as createTar } from 'tar';
import z from 'zod';
import { $ } from 'zx';

import { caller } from '../../clients/github';

import { getBot, getRepo, getTask } from './utils';

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/download',
    {
      schema: {
        body: z.object({
          task: z.object({
            id: z.number(),
            token: z.string(),
          }),
        }),
      },
    },
    async (request, reply) => {
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

      app.analytics.track(
        'Code Download Requested',
        {
          task_id: task.id,
          repo_id: repo.id,
          repo_name: repo.name,
          org_id: repo.orgs.id,
          org_name: repo.orgs.name,
          bot_name: bot.name,
          bot_org_name: bot.orgs.name,
        },
        undefined,
        repo.orgs,
      );

      let commitHash: string | undefined = undefined;

      const addProposalToken = async () => {
        // We ask the bots to send this token along with code proposal in order to
        // prevent race conditions when bots work on the same task at the same time
        const proposalToken = randomBytes(128).toString('base64url');

        await app.prisma.tasks.update({
          where: {
            id: task.id,
          },
          data: {
            proposal_token: proposalToken,
            proposal_base_commit: commitHash?.trim(),
          },
        });

        // Attach the proposal token to the response
        reply.header('x-automa-proposal-token', proposalToken);
      };

      // If no paths are specified for the bot, create a scoped access
      // token for the bot to download the entire repository and only that
      if (!bot.paths.length) {
        const { accessToken } = await caller(
          repo.orgs.github_installation_id!,
          [Number(repo.provider_id)],
          {
            contents: 'read',
          },
        );

        await addProposalToken();

        return reply.send({
          type: 'direct',
          url: `https://x-access-token:${accessToken}@github.com/${repo.orgs.provider_name}/${repo.name}`,
        });
      }

      // If the bot has specified paths, we will download only those paths
      // from the repository for security reasons
      const { accessToken } = await caller(repo.orgs.github_installation_id!);
      const workingDir = `/tmp/automa/download/tasks/${task.id}`;

      // Clone the repository
      await rm(workingDir, { recursive: true, force: true });
      await $`git clone --filter=tree:0 --no-checkout --depth=1 https://x-access-token:${accessToken}@github.com/${repo.orgs.provider_name}/${repo.name} ${workingDir}`;

      // Checkout the specified paths
      await $({
        cwd: workingDir,
      })`git -c core.ignoreCase=true sparse-checkout set --no-cone .gitignore ${bot.paths}`;

      await $({ cwd: workingDir })`git -c core.ignoreCase=true checkout`;

      // Get the head commit hash and store it along with the download token
      ({ stdout: commitHash } = await $({
        cwd: workingDir,
      })`git rev-parse HEAD`);

      // Refresh the .git directory
      await rm(join(workingDir, '.git'), { recursive: true, force: true });

      await $({ cwd: workingDir })`git init`;
      await $({ cwd: workingDir })`git add .`;
      await $({
        cwd: workingDir,
      })`git -c user.name="automa[bot]" -c user.email="60525818+automa[bot]@users.noreply.github.com" commit --allow-empty -m "Downloaded code"`;

      await addProposalToken();

      // Create an archive and stream it as a response
      reply.header('Content-Type', 'application/gzip');

      const tar = createTar(
        {
          gzip: true,
          cwd: workingDir,
        },
        ['.'],
      );

      // Delete the working directory after we finish streaming the tar
      tar.on('end', () => rm(workingDir, { recursive: true }));

      return reply.send(tar);
    },
  );
}
