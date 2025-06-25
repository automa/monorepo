import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { ArrowsClockwise, Code } from '@phosphor-icons/react';

import { useAnalyticsPage } from 'analytics';
import { TaskItemType } from 'gql/graphql';
import { Button, Flex, Loader, Tooltip, Typography } from 'shared';

import { getOrgSettingsLink } from 'orgs';
import { getRepoLink } from 'repos';
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
  const { data, loading, refetch } = useQuery(REPO_TASKS_QUERY, {
    variables: {
      org_id: org.id,
      repo_id: repo?.id as number,
    },
    skip: !repo?.id,
  });

  const repoLink = useMemo(() => getRepoLink(org, repo?.name), [repo, org]);

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
              {repo.has_installation && !repo.is_archived ? (
                <>
                  <Tooltip body="Refresh tasks">
                    <Button
                      variant="ghost"
                      icon
                      onClick={() => refetch()}
                      disabled={loading}
                    >
                      <ArrowsClockwise />
                    </Button>
                  </Tooltip>
                  <Button to={`../tasks/new?repo=${repo.id}`}>
                    Create Task
                  </Button>
                </>
              ) : (
                !repo.has_installation && (
                  <Tooltip body="Connect repository from provider">
                    <Button href={getOrgSettingsLink(org)} blank>
                      Connect
                    </Button>
                  </Tooltip>
                )
              )}
              <Tooltip body="View repository in provider">
                <Button variant="secondary" icon href={repoLink} blank>
                  <Code />
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
