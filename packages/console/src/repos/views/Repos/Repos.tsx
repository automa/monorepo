import React from 'react';
import { useQuery } from '@apollo/client';

import { Flex, Loader } from 'shared';
import { RepoCard } from 'repos';

import { ReposProps } from './types';

import { REPOS_QUERY } from './Repos.queries';
import { Container } from './Repos.styles';

const Repos: React.FC<ReposProps> = ({ org, ...props }) => {
  // TODO: Add infinite scroll
  const { data, loading } = useQuery(REPOS_QUERY, {
    variables: {
      org_id: org.id,
    },
  });

  return (
    <Container {...props} asChild>
      {loading && !data ? (
        <Flex justifyContent="center">
          <Loader />
        </Flex>
      ) : !data?.repos?.length ? (
        <Flex justifyContent="center">No repos</Flex>
      ) : (
        <Flex className="grid grid-cols-auto gap-4 md:gap-6">
          {data.repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </Flex>
      )}
    </Container>
  );
};

export default Repos;
