import React from 'react';
import { useQuery } from '@apollo/client';

import { useAnalyticsPage } from 'analytics';
import { Button, Flex, Loader, Typography } from 'shared';

import { Repo } from 'repos';

import { ReposProps } from './types';

import { REPOS_QUERY } from './Repos.queries';

const Repos: React.FC<ReposProps> = ({ org }) => {
  useAnalyticsPage('Repositories', 'Repositories Overview');

  // TODO: Add infinite scroll (with pagination cache)
  const { data, loading } = useQuery(REPOS_QUERY, {
    variables: {
      org_id: org.id,
    },
  });

  return (
    <Flex direction="column" className="gap-8">
      <Flex justifyContent="space-between" alignItems="center" className="h-9">
        <Typography variant="title6">Repositories</Typography>
        {/* TODO:(PR) Implement this link */}
        <Button to="../bots/new" blank>
          Configure
        </Button>
      </Flex>
      {loading && !data ? (
        <Loader />
      ) : !data?.repos.length ? (
        <Flex justifyContent="center">No repos</Flex>
      ) : (
        <Flex className="grid grid-cols-4 gap-4 md:gap-6">
          {data.repos.map((repo) => (
            <Repo key={repo.id} repo={repo} />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Repos;
