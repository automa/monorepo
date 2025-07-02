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
  const { state, merged } = body.pull_request;

  // Ignore reopening PRs
  if (state !== 'closed') {
    return;
  }

  // Find the task associated with the PR
  const taskItem = await app.prisma.task_items.findFirst({
    where: {
      type: task_item.proposal,
      AND: [
        {
          data: {
            path: ['prId'],
            equals: body.pull_request.id,
          },
        },
        {
          data: {
            path: ['prState'],
            equals: 'open',
          },
        },
      ],
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
    merged ? task_state.completed : task_state.cancelled,
    {
      user_id: automaUser?.users.id,
      data: userData,
    },
  );

  await app.events.sendWebhookProposalClosed.publish(taskItem.id, {
    proposalItemId: taskItem.id,
  });
};

export default {
  closed: changeState,
  reopened: changeState,
};
