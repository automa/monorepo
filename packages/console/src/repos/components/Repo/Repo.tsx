import React, { useMemo } from 'react';
import {
  Archive,
  CheckCircle,
  CircleHalf,
  CircleHalfTilt,
  Code,
  Globe,
  Lock,
  Plugs,
  PlusCircle,
} from '@phosphor-icons/react';

import { getFragment } from 'gql';
import { ProviderType, TaskState } from 'gql/graphql';
import { Anchor, Flex, Tooltip, Typography } from 'shared';

import { RepoProps } from './types';

import { REPO_FRAGMENT } from './Repo.queries';
import { Container, Item, ItemText, Title } from './Repo.styles';

const Repo: React.FC<RepoProps> = ({ org, repo: data, ...props }) => {
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

  const repoLink = useMemo(() => {
    if (!repo) return;

    if (org.provider_type === ProviderType.Github) {
      return `https://github.com/${org.provider_name}/${repo.name}`;
    }

    return;
  }, [repo, org]);

  return (
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
            <Title to={repo.name}>{repo.name}</Title>
          </Typography>
          <Flex alignItems="center" className="gap-2">
            {repo.is_archived ? (
              <Tooltip body="Archived">
                <Archive className="relative z-10 size-4 text-neutral-600" />
              </Tooltip>
            ) : (
              !repo.has_installation && (
                <Tooltip body="Repository not connected">
                  <Plugs className="relative z-10 size-4 text-red-500" />
                </Tooltip>
              )
            )}
            <Tooltip body={repo.is_private ? 'Private' : 'Public'}>
              {repo.is_private ? (
                <Lock className="relative z-10 size-4 text-neutral-600" />
              ) : (
                <Globe className="relative z-10 size-4 text-neutral-600" />
              )}
            </Tooltip>
            <Tooltip body="View repository in provider">
              <Anchor href={repoLink} blank>
                <Code className="relative z-10 size-4 text-neutral-600" />
              </Anchor>
            </Tooltip>
          </Flex>
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
  );
};

export default Repo;
