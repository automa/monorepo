import React, { ReactNode } from 'react';
import { Code, Icon, PlusCircle, Robot } from '@phosphor-icons/react';
import { format, formatDistanceToNow } from 'date-fns';

import { IntegrationType, ProviderType, TaskItemType } from '@automa/common';

import { getFragment } from 'gql';
import { Anchor, Avatar, Flex, Tooltip, Typography } from 'shared';

import { USER_AVATAR_FRAGMENT, UserAvatar } from 'users';

import { TaskItemProps } from './types';
import { originDefinitions, repoDefinitions } from './utils';

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

const TaskItem: React.FC<TaskItemProps> = ({ taskItem: data }) => {
  const taskItem = getFragment(TASK_ITEM_FRAGMENT, data);
  const user = getFragment(USER_AVATAR_FRAGMENT, taskItem.actor_user);

  if (taskItem.type === TaskItemType.Message) {
    return <div className="px-1 py-2">{taskItem.data.content}</div>;
  }

  if (taskItem.type === TaskItemType.Origin) {
    const definition =
      originDefinitions[taskItem.data.integration as IntegrationType];

    return (
      <TaskItemContainer icon={PlusCircle} timestamp={taskItem.created_at}>
        {taskItem.actor_user ? (
          <Subject>
            <UserAvatar user={taskItem.actor_user} size="small" />
            <Typography variant="small">{user!.name}</Typography>
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

    if (!definition) {
      return null;
    }

    return (
      <TaskItemContainer icon={Code} timestamp={taskItem.created_at}>
        <Subject>
          {taskItem.actor_user ? (
            <>
              <UserAvatar user={taskItem.actor_user} size="small" />
              <Typography variant="small">{user!.name}</Typography>
            </>
          ) : (
            <Typography variant="small">AI</Typography>
          )}
        </Subject>
        <Typography variant="small">
          decided to implement the task in
        </Typography>
        <Anchor href={`../repos`}>
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

    return (
      <TaskItemContainer icon={Robot} timestamp={taskItem.created_at}>
        <Subject>
          {taskItem.actor_user ? (
            <>
              <UserAvatar user={taskItem.actor_user} size="small" />
              <Typography variant="small">{user!.name}</Typography>
            </>
          ) : (
            <Typography variant="small">AI</Typography>
          )}
        </Subject>
        <Typography variant="small">assigned the task to</Typography>
        <Anchor href={`../bots/${name}`}>
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

  return null;
};

export default TaskItem;
