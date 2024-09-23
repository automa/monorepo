import React from 'react';
import { CheckCircle, CircleHalf } from '@phosphor-icons/react';
import { format } from 'date-fns';

import { ProviderType, TaskItemType } from '@automa/common';

import { getFragment } from 'gql';
import { Avatar, Flex, Tooltip, Typography } from 'shared';

import { TASK_FRAGMENT } from '../Task';
import { repoDefinitions, TASK_ITEM_FRAGMENT } from '../TaskItem';
import TaskItemBadge from '../TaskItemBadge';

import { TaskProps } from './types';

import { Container, Item, Title } from './TaskScheduled.styles';

const Task: React.FC<TaskProps> = ({ task: data, ...props }) => {
  const task = getFragment(TASK_FRAGMENT, data);
  const items = task.items.map((item) => getFragment(TASK_ITEM_FRAGMENT, item));

  const repo = items.find((item) => item.type === TaskItemType.Repo);
  const bot = items.find((item) => item.type === TaskItemType.Bot);

  if (!repo || !bot) {
    return null;
  }

  const botName = `${bot.data.botOrgName}/${bot.data.botName}`;

  const definition =
    repoDefinitions[repo.data.repoOrgProviderType as ProviderType];

  if (!definition) {
    return null;
  }

  // TODO: PR Badge
  return (
    <Container {...props}>
      <Flex direction="column" className="gap-4">
        <Flex justifyContent="space-between" alignItems="center">
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
        </Flex>
        <Item alignItems="center">
          <Avatar
            src={bot.data.botImageUrl}
            alt={bot.data.botName}
            variant="square"
            size="xsmall"
            className="ml-0.5"
          />
          <Title to={`../bots/${botName}`}>{botName}</Title>
        </Item>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" className="gap-2">
            <Title
              to={`../tasks/${task.id}`}
              variant="xsmall"
              className="text-neutral-500"
            >
              on
            </Title>
            <Item alignItems="center" className="gap-1">
              <definition.icon className="size-4" />
              {/* TODO: Fix link */}
              <Title to={`../repos`}>{repo.data.repoName}</Title>
            </Item>
          </Flex>
          <Flex alignItems="center" className="gap-2">
            {items
              .filter(({ type }) => type === TaskItemType.Proposal)
              .map(({ id, type, data }) => (
                <TaskItemBadge
                  key={id}
                  type={type}
                  data={data}
                  variant="secondary"
                />
              ))}
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Task;
