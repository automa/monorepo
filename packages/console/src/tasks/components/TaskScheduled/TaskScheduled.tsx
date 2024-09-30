import React from 'react';
import { format } from 'date-fns';

import { getFragment } from 'gql';
import { TaskItemType } from 'gql/graphql';
import { Avatar, Flex, Tooltip, Typography } from 'shared';

import { TASK_FRAGMENT } from '../Task';
import { repoDefinitions, TASK_ITEM_FRAGMENT } from '../TaskItem';
import TaskItemBadge from '../TaskItemBadge';
import TaskStateIcon from '../TaskStateIcon';

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

  const botName = `${bot.bot!.org.name}/${bot.bot!.name}`;

  const definition = repoDefinitions[repo.repo!.org.provider_type];

  if (!definition) {
    return null;
  }

  return (
    <Container {...props}>
      <Flex direction="column" className="gap-4">
        <Flex justifyContent="space-between" alignItems="center">
          <TaskStateIcon state={task.state} />
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
            src={bot.bot!.image_url ?? null}
            alt={bot.bot!.name}
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
              <Title to="../repos">{repo.repo!.name}</Title>
            </Item>
          </Flex>
          <Flex alignItems="center" className="gap-2">
            {items
              .filter(({ type }) => type === TaskItemType.Proposal)
              .map((taskItem) => (
                <TaskItemBadge
                  key={taskItem.id}
                  taskItem={taskItem}
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
