import React from 'react';
import { CheckCircle, CircleHalf, UserCircle } from '@phosphor-icons/react';
import { format } from 'date-fns';

import { TaskItemType } from '@automa/common';

import { getFragment } from 'gql';
import { Avatar, Flex, Tooltip, Typography } from 'shared';

import { UserAvatar } from 'users';

import { getTaskItemUser } from 'tasks/utils';

import { TASK_ITEM_FRAGMENT } from '../TaskItem';
import TaskItemBadge from '../TaskItemBadge';

import { TaskProps } from './types';

import { TASK_FRAGMENT } from './Task.queries';
import { Container, Title } from './Task.styles';

const Task: React.FC<TaskProps> = ({ task: data, ...props }) => {
  const task = getFragment(TASK_FRAGMENT, data);
  const items = task.items.map((item) => getFragment(TASK_ITEM_FRAGMENT, item));

  const origin = items.find(({ type }) => type === TaskItemType.Origin);

  const user = origin?.actor_user;
  const originUser = getTaskItemUser(origin?.data);

  return (
    <Container {...props}>
      <Flex justifyContent="space-between">
        <Flex alignItems="center" className="gap-2">
          {task.is_completed ? (
            <Tooltip
              body={`Completed at ${format(
                task.completed_at,
                'MMM dd, yyyy, hh:mm:ss a',
              )}`}
            >
              <CheckCircle className="relative z-10 size-5 text-green-500" />
            </Tooltip>
          ) : (
            <CircleHalf className="size-5 text-yellow-500" />
          )}
          <Title to={`../tasks/${task.id}`}>{task.title}</Title>
        </Flex>
        <Flex alignItems="center" className="gap-2">
          {items.map(({ id, type, data }) => (
            <TaskItemBadge key={id} type={type} data={data} />
          ))}
          <Tooltip
            body={`Created at ${format(
              task.created_at,
              'MMM dd, yyyy, hh:mm:ss a',
            )}`}
          >
            <Typography
              variant="xsmall"
              className="relative z-10 text-neutral-600"
            >
              {format(task.created_at, 'MMM d')}
            </Typography>
          </Tooltip>
          {user ? (
            <UserAvatar user={user} size="small" className="relative z-10" />
          ) : originUser.name ? (
            <Tooltip body={originUser.name}>
              <Avatar
                size="small"
                src={null}
                alt={originUser.name}
                className="relative z-10"
              />
            </Tooltip>
          ) : (
            <UserCircle className="size-5 text-neutral-400" />
          )}
        </Flex>
      </Flex>
    </Container>
  );
};

export default Task;
