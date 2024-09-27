import React, { ReactNode } from 'react';
import {
  Code,
  GitPullRequest,
  Icon,
  PlusCircle,
  Pulse,
  Robot,
} from '@phosphor-icons/react';
import { format, formatDistanceToNow } from 'date-fns';

import { getFragment } from 'gql';
import { IntegrationType, TaskItemType } from 'gql/graphql';
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
  const actorUser = getTaskItemUser(taskItem.data);
  // TODO: Shorten automa bot's name
  const botName = `${taskItem.bot?.org.name}/${taskItem.bot?.name}`;

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
          <Anchor href={definition.link(taskItem)}>
            <Subject>{definition.title(taskItem)}</Subject>
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
    const definition = repoDefinitions[taskItem.repo!.org.provider_type];

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
          ) : actorUser.name ? (
            <>
              <Avatar size="small" src={null} alt={actorUser.name} />
              <Typography variant="small">{actorUser.name}</Typography>
            </>
          ) : (
            <>
              <Logo className="size-4" />
              <Typography variant="small">
                Automa{scheduled ? '' : ' AI'}
              </Typography>
            </>
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
              <Typography variant="small">{taskItem.repo!.name}</Typography>
            </Subject>
          </Flex>
        </Anchor>
      </TaskItemContainer>
    );
  }

  if (taskItem.type === TaskItemType.Bot) {
    return (
      <TaskItemContainer icon={Robot} timestamp={taskItem.created_at}>
        <Subject>
          {taskItem.actor_user ? (
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
            <>
              <Logo className="size-4" />
              <Typography variant="small">
                Automa{scheduled ? '' : ' AI'}
              </Typography>
            </>
          )}
        </Subject>
        <Typography variant="small">assigned the task to</Typography>
        <Anchor to={`../bots/${botName}`}>
          <Flex alignItems="center" className="gap-1">
            <Avatar
              src={taskItem.bot!.image_url ?? null}
              alt={taskItem.bot!.name}
              variant="square"
              size="xsmall"
              className="ml-0.5"
            />
            <Subject>
              <Typography variant="small">{botName}</Typography>
            </Subject>
          </Flex>
        </Anchor>
      </TaskItemContainer>
    );
  }

  if (taskItem.type === TaskItemType.Proposal) {
    const definition = proposalDefinitions[taskItem.repo!.org.provider_type];
    const botName = `${taskItem.bot!.org.name}/${taskItem.bot!.name}`;

    if (!definition) {
      return null;
    }

    return (
      <TaskItemContainer icon={GitPullRequest} timestamp={taskItem.created_at}>
        <Anchor to={`../bots/${botName}`}>
          <Flex alignItems="center" className="gap-1">
            <Avatar
              src={taskItem.bot!.image_url ?? null}
              alt={taskItem.bot!.name}
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
        <Anchor href={definition.link(taskItem)}>
          <Subject>{definition.title(taskItem)}</Subject>
        </Anchor>
      </TaskItemContainer>
    );
  }

  if (taskItem.type === TaskItemType.Activity) {
    return (
      <TaskItemContainer icon={Pulse} timestamp={taskItem.created_at}>
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
        ) : taskItem.bot ? (
          <Anchor to={`../bots/${botName}`}>
            <Flex alignItems="center" className="gap-1">
              <Avatar
                src={taskItem.bot.image_url ?? null}
                alt={taskItem.bot.name}
                variant="square"
                size="xsmall"
                className="ml-0.5"
              />
              <Subject>
                <Typography variant="small">{botName}</Typography>
              </Subject>
            </Flex>
          </Anchor>
        ) : (
          <Subject>
            <Logo className="size-4" />
            <Typography variant="small">Automa</Typography>
          </Subject>
        )}
        <Typography variant="small">
          changed the {taskItem.activity!.type} from
        </Typography>
        <Subject>
          <Typography variant="small">
            {taskItem.activity!.from_state}
          </Typography>
        </Subject>
        <Typography variant="small">to</Typography>
        <Subject>
          <Typography variant="small">{taskItem.activity!.to_state}</Typography>
        </Subject>
      </TaskItemContainer>
    );
  }

  return null;
};

export default TaskItem;
