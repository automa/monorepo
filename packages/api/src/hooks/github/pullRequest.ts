import { integration, provider, task_item, task_state } from '@automa/prisma';

import { taskUpdateState } from '../../db';

import {
  GithubEventActionHandler,
  GithubInstallationMinimal,
  GithubOrganization,
  GithubSender,
} from './types';

type PullRequest = {
  id: number;
  number: number;
  state: 'open' | 'closed';
  merged: boolean;
};

const changeState: GithubEventActionHandler<{
  sender: GithubSender;
  installation: GithubInstallationMinimal;
  organization: GithubOrganization;
  pull_request: PullRequest;
}> = async (app, body) => {
  // Find the task associated with the PR
  const taskItem = await app.prisma.task_items.findFirst({
    where: {
      type: task_item.proposal,
      data: {
        path: ['prId'],
        equals: body.pull_request.id,
      },
    },
    include: {
      tasks: true,
    },
  });

  if (!taskItem) {
    return;
  }

  // Find the user who triggered the action
  const automaUser = await app.prisma.user_providers.findFirst({
    where: {
      provider_type: provider.github,
      provider_id: `${body.sender.id}`,
    },
    include: {
      users: true,
    },
  });
  const userData = !automaUser
    ? {
        integration: integration.github,
        userId: body.sender.id,
        userName: body.sender.login,
      }
    : null;

  const { state, merged } = body.pull_request;

  // Update the data inside the task proposal item
  await app.prisma.task_items.update({
    where: {
      id: taskItem.id,
    },
    data: {
      data: {
        ...(taskItem.data as object),
        prState: state,
        prMerged: merged,
      },
    },
  });

  // Update the task state based on the PR state
  await taskUpdateState(
    app,
    taskItem.tasks.id,
    state === 'open'
      ? task_state.submitted
      : merged
      ? task_state.completed
      : task_state.cancelled,
    {
      user_id: automaUser?.users.id,
      data: userData,
    },
  );
};

export default {
  closed: changeState,
  reopened: changeState,
};
