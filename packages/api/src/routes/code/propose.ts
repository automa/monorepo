import { mkdir, rm } from 'node:fs/promises';

import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { $ } from 'zx';

import { integration, task_item, task_state } from '@automa/prisma';

import { env } from '../../env';

import { caller } from '../../clients/github';
import { taskUpdateState } from '../../db';

import { getBot, getRepo, getTask } from './utils';

type PullRequest = {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  merged: boolean;
  head: { label: string };
  base: { ref: string };
};

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/propose',
    {
      schema: {
        body: z.object({
          task: z.object({
            id: z.number(),
            token: z.string(),
          }),
          proposal: z.object({
            token: z.string(),
            diff: z.string(),
            title: z.string().optional(),
            body: z.string().optional(),
            base_commit: z.string().optional(),
          }),
        }),
      },
    },
    async (request, reply) => {
      const { proposal } = request.body;

      const task = await getTask(app, reply, request.body.task);

      if (!task) {
        return;
      }

      // TODO: Allow empty proposal token if no download has happened
      if (task.proposal_token !== proposal.token) {
        return reply.forbidden('Wrong proposal token provided');
      }

      const proposalBaseCommit =
        task.proposal_base_commit || proposal.base_commit;

      if (!proposalBaseCommit) {
        return reply.badRequest(
          JSON.stringify([
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['proposal', 'base_commit'],
              message: 'Required',
            },
          ]),
        );
      }

      const repo = await getRepo(app, reply, task);

      if (!repo) {
        return;
      }

      // If the task already has a proposal, we return immediately with it.
      // This can happen if there's an error after we saved the proposal in a previous try
      const proposalItem = task.task_items.find(
        (item) => item.type === task_item.proposal,
      );

      if (
        proposalItem?.data &&
        typeof proposalItem.data === 'object' &&
        !Array.isArray(proposalItem.data)
      ) {
        return reply.code(204).send();
      }

      const bot = await getBot(app, reply, task);

      if (!bot) {
        return;
      }

      const { accessToken, axios } = await caller(
        repo.orgs.github_installation_id!,
      );

      // We remove the org name for bots from the automa org to reduce noise.
      const botName =
        bot.orgs.name === 'automa' ? bot.name : `${bot.orgs.name}/${bot.name}`;

      // Calculate the branch name for the proposal (github has limit of 244).
      // We do not support a branch name param since we don't want the user to change branch names
      // in between retries since we're using the branch name to check if the PR already exists.
      const branch = `automa/${botName}/${task.id}`.slice(0, 244);

      // Check if the PR for the branch already exists.
      // This can happen if there's an error after we created the PR in a previous try
      const {
        data: { default_branch },
      } = await axios.get(`/repos/${repo.orgs.provider_name}/${repo.name}`);

      let {
        data: [pr],
      } = await axios.get<PullRequest[]>(
        `/repos/${repo.orgs.provider_name}/${repo.name}/pulls`,
        {
          params: {
            head: `${repo.orgs.provider_name}:${branch}`,
            base: default_branch,
          },
        },
      );

      const finish = async () => {
        // Not doing `Promise.all` in order to be fault tolerant
        // Not using taskUpdateState since we don't want to create an activity
        await app.prisma.tasks.update({
          where: {
            id: task.id,
          },
          data: {
            state:
              pr.state === 'open'
                ? task_state.submitted
                : pr.merged
                ? task_state.completed
                : task_state.cancelled,
          },
        });

        await app.prisma.task_items.create({
          data: {
            task_id: task.id,
            type: task_item.proposal,
            data: {
              prId: pr.id,
              prNumber: pr.number,
              prTitle: pr.title,
              prState: pr.state,
              prMerged: pr.merged,
              prHead: pr.head.label,
              prBase: pr.base.ref,
            },
            bot_id: bot.id,
            repo_id: repo.id,
          },
        });

        return reply.code(204).send();
      };

      // Return early and no need to clone the repository if the PR already exists
      if (pr) {
        return finish();
      }

      // TODO: Move it up
      // Complete the task if the diff is empty
      if (!proposal.diff) {
        await taskUpdateState(app, task.id, task_state.skipped, {
          bot_id: bot.id,
        });

        return reply.code(204).send();
      }

      // Calculate the commit title & description for the proposal
      const taskLink = `${env.CLIENT_URI}/${repo.orgs.name}/tasks/${task.id}`;
      const botLink = `${env.CLIENT_URI}/${repo.orgs.name}/bots/${bot.orgs.name}/${bot.name}`;

      const title =
        proposal.title || `Implemented automa@${task.id} using ${botName} bot`;
      let body = `${
        proposal.body ? `${proposal.body}\n\n` : ''
      }This PR was created for task [${
        task.id
      }](${taskLink}) by [${botName}](${botLink}) bot using [Automa](https://automa.app).`;

      // Create a working directory
      const workingDir = `/tmp/automa/propose/tasks/${task.id}`;

      await rm(workingDir, { recursive: true, force: true });
      await mkdir(workingDir, { recursive: true });

      // Initialize as bare repo and fetch the specific commit
      await $({ cwd: workingDir })`git init --bare`;
      await $({
        cwd: workingDir,
      })`git remote add origin https://x-access-token:${accessToken}@github.com/${repo.orgs.provider_name}/${repo.name}`;
      // TODO: We need to have a timeout for this to safeguard against malicious users
      await $({
        cwd: workingDir,
      })`git fetch --depth 1 origin ${proposalBaseCommit}`;

      // Read the base commit tree & apply the diff
      await $({
        cwd: workingDir,
      })`git read-tree ${proposalBaseCommit}`;
      await $({ cwd: workingDir, input: proposal.diff })`git apply --cached`;

      // Create tree and commit objects
      const { stdout: treeHash } = await $({
        cwd: workingDir,
      })`git write-tree`;

      const { stdout: commitHash } = await $({
        cwd: workingDir,
      })`git -c user.name="automa[bot]" -c user.email="60525818+automa[bot]@users.noreply.github.com" commit-tree ${treeHash.trim()} -p ${proposalBaseCommit} -m ${title}`;

      // Update the branch reference to point to the new commit
      await $({
        cwd: workingDir,
      })`git update-ref refs/heads/${branch} ${commitHash.trim()}`;

      // Push the changes
      await $({
        cwd: workingDir,
      })`git push -f origin refs/heads/${branch}:refs/heads/${branch}`;

      // Remove the working directory
      await rm(workingDir, { recursive: true, force: true });

      // Check the integration info to let the PR close the task if merged
      const origin = task.task_items.find(
        (item) => item.type === task_item.origin,
      );

      if (
        origin?.data &&
        typeof origin.data === 'object' &&
        !Array.isArray(origin.data)
      ) {
        if (origin.data.integration === integration.linear) {
          const issueId = origin.data.issueIdentifier as string;
          const organizationUrlKey = origin.data.organizationUrlKey as string;

          if (issueId && organizationUrlKey) {
            body = `Fixes [${issueId}](https://linear.app/${organizationUrlKey}/issue/${issueId})\n\n${body}`;
          }
        }
      }

      // Create a pull request
      ({ data: pr } = await axios.post<PullRequest>(
        `/repos/${repo.orgs.provider_name}/${repo.name}/pulls`,
        {
          title,
          ...(body && { body }),
          head: branch,
          base: default_branch,
          maintainer_can_modify: true,
        },
      ));

      app.analytics.track(
        'Code Proposal Created',
        {
          task_id: task.id,
          repo_id: repo.id,
          repo_name: repo.name,
          org_id: repo.orgs.id,
          org_name: repo.orgs.name,
          bot_name: bot.name,
          bot_org_name: bot.orgs.name,
          org_provider_type: repo.orgs.provider_type,
          org_provider_name: repo.orgs.provider_name,
          proposal_provider_number: pr.number,
        },
        undefined,
        repo.orgs,
      );

      return finish();
    },
  );
}
