import { mkdir, rm, unlink, writeFile } from 'node:fs/promises';

import { FastifyInstance } from 'fastify';
import { $ } from 'zx';

import { task_item } from '@automa/prisma';

import { caller } from '../../clients/github';

import { getBot, getRepo, getTask } from './utils';

export default async function (app: FastifyInstance) {
  app.post<{
    Body: {
      task: {
        id: number;
        token: string;
      };
      proposal: {
        token: string;
        diff: string;
        message?: string;
      };
    };
  }>('/propose', async (request, reply) => {
    const { proposal } = request.body;

    const task = await getTask(app, reply, request.body.task);

    if (!task) {
      return;
    }

    if (task.proposal_token !== proposal.token) {
      return reply.forbidden('Wrong proposal token provided');
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
      return reply.code(200).send({
        proposal: {
          type: repo.orgs.provider_type,
          id: proposalItem.data.prId,
          title: proposalItem.data.prTitle,
          head: proposalItem.data.prHead,
          base: proposalItem.data.prBase,
        },
      });
    }

    // Complete the task if the diff is empty
    if (!proposal.diff) {
      await app.prisma.tasks.update({
        where: {
          id: task.id,
        },
        data: {
          // TODO: Mark the task as skipped when we have a proper status for it
          completed_at: new Date(),
        },
      });

      return reply.code(204).send();
    }

    const bot = await getBot(app, reply, task);

    if (!bot) {
      return;
    }

    const { accessToken, axios } = await caller(
      repo.orgs.github_installation_id!,
    );
    const workingDir = `/tmp/automa/propose/tasks/${task.id}`;

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
    } = await axios.get(
      `/repos/${repo.orgs.provider_name}/${repo.name}/pulls`,
      {
        params: {
          head: `${repo.orgs.provider_name}:${branch}`,
          base: default_branch,
        },
      },
    );

    // Return early and no need to clone the repository if the PR already exists
    const finish = async () => {
      await app.prisma.task_items.create({
        data: {
          task_id: task.id,
          type: task_item.proposal,
          data: {
            prId: pr.number,
            prTitle: pr.title,
            prState: pr.state,
            prMerged: pr.merged,
            prHead: pr.head.label,
            prBase: pr.base.ref,
          },
        },
      });

      return reply.code(201).send({
        proposal: {
          type: repo.orgs.provider_type,
          id: pr.number,
          title: pr.title,
          head: pr.head.label,
          base: pr.base.ref,
        },
      });
    };

    if (pr) {
      return finish();
    }

    // Calculate the commit title & description for the proposal
    const title =
      proposal.message || `Implemented automa#${task.id} using ${botName} bot`;

    // Create a working directory
    await rm(workingDir, { recursive: true, force: true });
    await mkdir(workingDir, { recursive: true });

    // Do a shallow clone of the repository for a specific commit
    await $({ cwd: workingDir })`git init`;
    await $({
      cwd: workingDir,
    })`git remote add origin https://x-access-token:${accessToken}@github.com/${repo.orgs.provider_name}/${repo.name}`;
    await $({
      cwd: workingDir,
    })`git fetch --depth 1 origin ${task.proposal_base_commit}`;

    // Set the git user
    await $({ cwd: workingDir })`git config user.name "automa[bot]"`;
    await $({
      cwd: workingDir,
    })`git config user.email "60525818+automa[bot]@users.noreply.github.com"`;

    // Write the diff to a file
    await writeFile(`${workingDir}.diff`, proposal.diff);

    // Checkout and commit the diff
    // TODO: Find a way to apply the commit without checking out
    await $({ cwd: workingDir })`git checkout ${task.proposal_base_commit}`;
    await $({
      cwd: workingDir,
    })`git apply --index ${workingDir}.diff`;
    await $({
      cwd: workingDir,
    })`git commit -m ${title}`;

    // Push the changes
    await $({ cwd: workingDir })`git push -f origin HEAD:refs/heads/${branch}`;

    // Remove the working directory and the diff
    await rm(workingDir, { recursive: true, force: true });
    await unlink(`${workingDir}.diff`);

    // Create a pull request
    ({ data: pr } = await axios.post(
      `/repos/${repo.orgs.provider_name}/${repo.name}/pulls`,
      {
        title,
        head: branch,
        base: default_branch,
        maintainer_can_modify: true,
      },
    ));

    return finish();
  });
}
