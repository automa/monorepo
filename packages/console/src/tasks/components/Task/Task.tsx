import React from 'react';
import { CheckCircle, CircleHalf, UserCircle } from '@phosphor-icons/react';
import { format } from 'date-fns';

import { getFragment } from 'gql';
import { Flex, Tooltip, Typography } from 'shared';

import { UserAvatar } from 'users';

import TaskItemBadge from '../TaskItemBadge';

import { TaskProps } from './types';

import { TASK_FRAGMENT } from './Task.queries';
import { Container, Title } from './Task.styles';

const Task: React.FC<TaskProps> = ({ task: data, ...props }) => {
  const task = getFragment(TASK_FRAGMENT, data);

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
              <CheckCircle className="size-5 text-green-500" />
            </Tooltip>
          ) : (
            <CircleHalf className="size-5 text-yellow-500" />
          )}
          <Title to={`../tasks/${task.id}`}>{task.title}</Title>
        </Flex>
        <Flex alignItems="center" className="gap-2">
          {task.items
            .filter(({ type }) => type === 'origin')
            .map(({ id, origin }) => (
              <TaskItemBadge key={id} data={origin} />
            ))}
          <Tooltip
            body={`Created at ${format(
              task.created_at,
              'MMM dd, yyyy, hh:mm:ss a',
            )}`}
          >
            <Typography variant="xsmall" className="text-neutral-600">
              {format(task.created_at, 'MMM d')}
            </Typography>
          </Tooltip>
          {task.author ? (
            <UserAvatar user={task.author} size="small" />
          ) : (
            <UserCircle className="size-5 text-neutral-400" />
          )}
        </Flex>
      </Flex>
    </Container>
  );
};

export default Task;
