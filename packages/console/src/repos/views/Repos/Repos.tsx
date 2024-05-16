import React from 'react';
import { useQuery } from '@apollo/client';

import { Flex, Loader } from 'shared';
import { Repo } from 'repos';

import { ReposProps } from './types';

import { REPOS_QUERY } from './Repos.queries';

const Repos: React.FC<ReposProps> = ({ org }) => {
  // TODO: Add infinite scroll
  const { data, loading } = useQuery(REPOS_QUERY, {
    variables: {
      org_id: org.id,
    },
  });

  return (
    <>
      {loading && !data ? (
        <Flex justifyContent="center">
          <Loader />
        </Flex>
      ) : !data?.repos?.length ? (
        <Flex justifyContent="center">No repos</Flex>
      ) : (
        <Flex className="grid grid-cols-auto gap-4 md:gap-6">
          {data.repos.map((repo) => (
            <Repo key={repo.id} repo={repo} />
          ))}
        </Flex>
      )}
    </>
  );
};

export default Repos;
