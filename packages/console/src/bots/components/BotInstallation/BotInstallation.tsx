import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  CircleHalf,
  CircleHalfTilt,
  PlusCircle,
  Robot,
} from '@phosphor-icons/react';
import { format } from 'date-fns';

import { getFragment } from 'gql';
import { TaskState } from 'gql/graphql';
import { Flex, Tooltip, Typography } from 'shared';

import { BotInstallationProps } from './types';

import { BOT_INSTALLATION_FRAGMENT } from './BotInstallation.queries';
import { Container, Item, ItemText } from './BotInstallation.styles';

const BotInstallation: React.FC<BotInstallationProps> = ({
  botInstallation: data,
  ...props
}) => {
  const botInstallation = getFragment(BOT_INSTALLATION_FRAGMENT, data);
  const bot = botInstallation.bot;

  const taskCounts = useMemo(() => {
    return botInstallation.tasks_count.reduce(
      (acc, { state, count }) => ({
        ...acc,
        [state]: count,
      }),
      {} as Record<TaskState, number>,
    );
  }, [botInstallation.tasks_count]);

  const totalTasksCount = useMemo(() => {
    return botInstallation.tasks_count.reduce(
      (acc, { count }) => acc + count,
      0,
    );
  }, [botInstallation.tasks_count]);

  const completedTasksCount = useMemo(() => {
    return (
      (taskCounts[TaskState.Completed] || 0) +
      (taskCounts[TaskState.Skipped] || 0)
    );
  }, [taskCounts]);

  return (
    <Link to={`${bot.org.name}/${bot.name}`}>
      <Container>
        <Flex justifyContent="space-between">
          <Flex {...props} alignItems="center" className="gap-4">
            {bot.image_url ? (
              <img src={bot.image_url} alt={bot.name} className="size-6" />
            ) : (
              <Robot className="size-6 text-neutral-400" />
            )}
            <Flex alignItems="center" className="gap-2">
              <Typography variant="medium" className="break-all">
                {bot.org.name} / {bot.name}
              </Typography>
            </Flex>
          </Flex>
          <Flex alignItems="center" className="gap-4">
            <Tooltip body="Tasks assigned to this bot">
              <Item>
                <PlusCircle className="size-4" />
                <ItemText>{totalTasksCount}</ItemText>
              </Item>
            </Tooltip>
            <Tooltip body="Tasks completed by this bot">
              <Item variant="success">
                <CheckCircle className="size-4" />
                <ItemText>{completedTasksCount}</ItemText>
              </Item>
            </Tooltip>
            <Tooltip body="Tasks currently submitted by this bot">
              <Item variant="info">
                <CircleHalfTilt className="size-4" />
                <ItemText>{taskCounts[TaskState.Submitted] || 0}</ItemText>
              </Item>
            </Tooltip>
            <Tooltip body="Tasks currently started by this bot">
              <Item variant="warning">
                <CircleHalf className="size-4" />
                <ItemText>{taskCounts[TaskState.Started] || 0}</ItemText>
              </Item>
            </Tooltip>
            <Tooltip
              body={`Installed at ${format(
                botInstallation.created_at,
                'MMM dd, yyyy, hh:mm:ss a',
              )}`}
            >
              <ItemText className="text-neutral-600">
                {format(botInstallation.created_at, 'MMM d')}
              </ItemText>
            </Tooltip>
          </Flex>
        </Flex>
      </Container>
    </Link>
  );
};

export default BotInstallation;
