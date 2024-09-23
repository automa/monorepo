import React, { ReactNode } from 'react';
import {
  Code,
  GitPullRequest,
  Icon,
  PlusCircle,
  Robot,
} from '@phosphor-icons/react';
import { format, formatDistanceToNow } from 'date-fns';

import { IntegrationType, ProviderType, TaskItemType } from '@automa/common';

import { getFragment } from 'gql';
import { Anchor, Avatar, Flex, Tooltip, Typography } from 'shared';

import { USER_AVATAR_FRAGMENT, UserAvatar } from 'users';

import Logo from 'assets/logo.svg?react';

import { getTaskItemUser } from 'tasks/utils';

import { TaskItemProps } from './types';
import {
  originDefinitions,
  proposalDefinitions,
  repoDefinitions,
} from './utils';

import { TASK_ITEM_FRAGMENT } from './TaskItem.queries';
import { Line, Subject } from './TaskItem.styles';

const TaskItemContainer: React.FC<{
  icon: Icon;
  timestamp: string;
  children: ReactNode;
}> = ({ icon: Icon, timestamp, children }) => {
  // TODO: Link to the task item
  return (
    <Line>
      <Icon className="mr-1 size-4" />
      {children}
      <Typography variant="small">·</Typography>
      <Tooltip body={format(timestamp, 'MMM d, yyyy, h:mm:ss a')}>
        <Typography variant="xsmall">
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </Typography>
      </Tooltip>
    </Line>
  );
};

const TaskItem: React.FC<TaskItemProps> = ({ taskItem: data, scheduled }) => {
  const taskItem = getFragment(TASK_ITEM_FRAGMENT, data);
  const user = getFragment(USER_AVATAR_FRAGMENT, taskItem.actor_user);

  if (taskItem.type === TaskItemType.Message) {
    return <div className="px-1 py-2">{taskItem.data.content}</div>;
  }

  if (taskItem.type === TaskItemType.Origin) {
    const definition =
      originDefinitions[taskItem.data.integration as IntegrationType];
    const actorUser = getTaskItemUser(taskItem.data);

    return (
      <TaskItemContainer icon={PlusCircle} timestamp={taskItem.created_at}>
        {taskItem.actor_user ? (
          <Subject>
            <UserAvatar user={taskItem.actor_user} size="small" />
            <Typography variant="small">{user!.name}</Typography>
          </Subject>
        ) : actorUser.name ? (
          <Subject>
            <Avatar size="small" src={null} alt={actorUser.name} />
            <Typography variant="small">{actorUser.name}</Typography>
          </Subject>
        ) : (
          <Typography variant="small">Someone</Typography>
        )}
        <Typography variant="small">created the task from</Typography>
        {definition ? (
          <Anchor href={definition.link(taskItem.data)}>
            <Subject>{definition.title(taskItem.data)}</Subject>
          </Anchor>
        ) : (
          <Subject>
            <Typography variant="small">UI</Typography>
          </Subject>
        )}
      </TaskItemContainer>
    );
  }

  if (taskItem.type === TaskItemType.Repo) {
    const definition =
      repoDefinitions[taskItem.data.repoOrgProviderType as ProviderType];
    const actorUser = getTaskItemUser(taskItem.data);

    if (!definition) {
      return null;
    }

    return (
      <TaskItemContainer icon={Code} timestamp={taskItem.created_at}>
        <Subject>
          {scheduled ? (
            <>
              <Logo className="size-4" />
              <Typography variant="small">Automa</Typography>
            </>
          ) : taskItem.actor_user ? (
            <>
              <UserAvatar user={taskItem.actor_user} size="small" />
              <Typography variant="small">{user!.name}</Typography>
            </>
          ) : actorUser.name ? (
            <>
              <Avatar size="small" src={null} alt={actorUser.name} />
              <Typography variant="small">{actorUser.name}</Typography>
            </>
          ) : (
            <Typography variant="small">AI</Typography>
          )}
        </Subject>
        <Typography variant="small">
          decided to implement the task in
        </Typography>
        {/* TODO: Fix link */}
        <Anchor to={`../repos`}>
          <Flex alignItems="center" className="gap-1">
            <definition.icon className="ml-0.5 size-3" />
            <Subject>
              <Typography variant="small">
                {taskItem.data.repoOrgName}/{taskItem.data.repoName}
              </Typography>
            </Subject>
          </Flex>
        </Anchor>
      </TaskItemContainer>
    );
  }

  if (taskItem.type === TaskItemType.Bot) {
    const name = `${taskItem.data.botOrgName}/${taskItem.data.botName}`;
    const actorUser = getTaskItemUser(taskItem.data);

    return (
      <TaskItemContainer icon={Robot} timestamp={taskItem.created_at}>
        <Subject>
          {scheduled ? (
            <>
              <Logo className="size-4" />
              <Typography variant="small">Automa</Typography>
            </>
          ) : taskItem.actor_user ? (
            <>
              <UserAvatar user={taskItem.actor_user} size="small" />
              <Typography variant="small">{user!.name}</Typography>
            </>
          ) : actorUser.name ? (
            <>
              <Avatar size="small" src={null} alt={actorUser.name} />
              <Typography variant="small">{actorUser.name}</Typography>
            </>
          ) : (
            <Typography variant="small">AI</Typography>
          )}
        </Subject>
        <Typography variant="small">assigned the task to</Typography>
        <Anchor to={`../bots/${name}`}>
          <Flex alignItems="center" className="gap-1">
            <Avatar
              src={taskItem.data.botImageUrl}
              alt={taskItem.data.botName}
              variant="square"
              size="xsmall"
              className="ml-0.5"
            />
            <Subject>
              <Typography variant="small">{name}</Typography>
            </Subject>
          </Flex>
        </Anchor>
      </TaskItemContainer>
    );
  }

  if (taskItem.type === TaskItemType.Proposal) {
    const definition =
      proposalDefinitions[taskItem.data.repoOrgProviderType as ProviderType];
    const botName = `${taskItem.data.botOrgName}/${taskItem.data.botName}`;

    if (!definition) {
      return null;
    }

    return (
      <TaskItemContainer icon={GitPullRequest} timestamp={taskItem.created_at}>
        <Anchor to={`../bots/${botName}`}>
          <Flex alignItems="center" className="gap-1">
            <Avatar
              src={taskItem.data.botImageUrl}
              alt={taskItem.data.botName}
              variant="square"
              size="xsmall"
              className="ml-0.5"
            />
            <Subject>
              <Typography variant="small">{botName}</Typography>
            </Subject>
          </Flex>
        </Anchor>
        <Typography variant="small">proposed changes to code at</Typography>
        <Anchor href={definition.link(taskItem.data)}>
          <Subject>{definition.title(taskItem.data)}</Subject>
        </Anchor>
      </TaskItemContainer>
    );
  }

  return null;
};

export default TaskItem;
