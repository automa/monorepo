import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  CircleHalf,
  CircleHalfTilt,
  Globe,
  Lock,
  PlusCircle,
} from '@phosphor-icons/react';

import { getFragment } from 'gql';
import { TaskState } from 'gql/graphql';
import { Flex, Tooltip, Typography } from 'shared';

import { RepoProps } from './types';

import { REPO_FRAGMENT } from './Repo.queries';
import { Container, Item, ItemText } from './Repo.styles';

const Repo: React.FC<RepoProps> = ({ repo: data, ...props }) => {
  const repo = getFragment(REPO_FRAGMENT, data);

  const taskCounts = useMemo(() => {
    return repo.tasks_count.reduce(
      (acc, { state, count }) => ({
        ...acc,
        [state]: count,
      }),
      {} as Record<TaskState, number>,
    );
  }, [repo.tasks_count]);

  const totalTasksCount = useMemo(() => {
    return repo.tasks_count.reduce((acc, { count }) => acc + count, 0);
  }, [repo.tasks_count]);

  const completedTasksCount = useMemo(() => {
    return (
      (taskCounts[TaskState.Completed] || 0) +
      (taskCounts[TaskState.Skipped] || 0)
    );
  }, [taskCounts]);

  return (
    <Link to={`${repo.name}`}>
      <Container {...props}>
        <Flex
          direction="column"
          justifyContent="space-between"
          className="h-full gap-6"
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
            className="gap-4"
          >
            <Typography variant="large" className="break-all">
              {repo.name}
            </Typography>
            <Tooltip body={repo.is_private ? 'Private' : 'Public'}>
              {repo.is_private ? (
                <Lock className="size-4 text-neutral-600" />
              ) : (
                <Globe className="size-4 text-neutral-600" />
              )}
            </Tooltip>
          </Flex>
          <Flex alignItems="center" className="gap-4">
            <Tooltip body="Total tasks for this repo">
              <Item>
                <PlusCircle className="size-4" />
                <ItemText>{totalTasksCount}</ItemText>
              </Item>
            </Tooltip>
            <Tooltip body="Tasks completed in this repo">
              <Item variant="success">
                <CheckCircle className="size-4" />
                <ItemText>{completedTasksCount}</ItemText>
              </Item>
            </Tooltip>
            <Tooltip body="Tasks currently submitted to this repo">
              <Item variant="info">
                <CircleHalfTilt className="size-4" />
                <ItemText>{taskCounts[TaskState.Submitted] || 0}</ItemText>
              </Item>
            </Tooltip>
            <Tooltip body="Tasks currently started for this repo">
              <Item variant="warning">
                <CircleHalf className="size-4" />
                <ItemText>{taskCounts[TaskState.Started] || 0}</ItemText>
              </Item>
            </Tooltip>
          </Flex>
        </Flex>
      </Container>
    </Link>
  );
};

export default Repo;
