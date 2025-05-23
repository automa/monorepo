import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { ShareFat } from '@phosphor-icons/react';

import { useAnalyticsPage } from 'analytics';
import { ProviderType, TaskItemType } from 'gql/graphql';
import { Button, Flex, Loader, Tooltip, Typography } from 'shared';

import { Task } from 'tasks';

import { RepoProps } from './types';

import { REPO_QUERY, REPO_TASKS_QUERY } from './Repo.queries';

const Repo: React.FC<RepoProps> = ({ org }) => {
  const { repoName } = useParams();

  useAnalyticsPage('Repositories', 'Repository Overview');

  const { data: repoData, loading: repoLoading } = useQuery(REPO_QUERY, {
    variables: {
      name: repoName!,
      org_id: org.id,
    },
    skip: !repoName,
  });

  const repo = repoData?.repo;

  // TODO: Add infinite scroll (with pagination cache)
  const { data, loading } = useQuery(REPO_TASKS_QUERY, {
    variables: {
      org_id: org.id,
      repo_id: repo?.id as number,
    },
    skip: !repo?.id,
  });

  const repoLink = useMemo(() => {
    if (!repo) return;

    if (repo.org.provider_type === ProviderType.Github) {
      return `https://github.com/${repo.org.name}/${repo.name}`;
    }

    return;
  }, [repo]);

  return (
    <Flex direction="column" className="gap-8">
      {repoLoading && !repo ? (
        <Loader />
      ) : !repo ? (
        <Flex justifyContent="center">Not found</Flex>
      ) : (
        <>
          <Flex justifyContent="space-between" alignItems="center">
            <Typography variant="title4">{repoName}</Typography>
            <Flex alignItems="center" className="gap-2">
              {repo.has_installation && (
                <Button to={`../tasks/new?repo=${repo.id}`}>Create Task</Button>
              )}
              <Tooltip body="View repository in provider">
                <Button variant="secondary" icon href={repoLink} blank>
                  <ShareFat weight="fill" />
                </Button>
              </Tooltip>
            </Flex>
          </Flex>
          {loading && !data ? (
            <Loader />
          ) : !data?.tasks.length ? (
            <Flex justifyContent="center">No tasks</Flex>
          ) : (
            <Flex direction="column" className="gap-4">
              {data.tasks.map((task) => (
                <Task
                  key={task.id}
                  task={task}
                  filteredOn={[TaskItemType.Repo]}
                />
              ))}
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
};

export default Repo;
