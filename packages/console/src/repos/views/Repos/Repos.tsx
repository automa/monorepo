import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { Flex, Typography } from 'shared';
import { orgUri } from 'utils';

import { ReposProps } from './types';

import { REPOS_QUERY } from './Repos.queries';
import { Container } from './Repos.styles';

const Repos: React.FC<ReposProps> = ({ org, ...props }) => {
  const navigate = useNavigate();

  // TODO: Add infinite scroll
  const { data, loading } = useQuery(REPOS_QUERY, {
    variables: {
      org_id: org.id,
    },
  });

  return (
    <Container {...props} asChild>
      {loading && !data ? (
        <div>Loading</div>
      ) : !data?.repos?.length ? (
        <Flex justifyContent="center">No repos</Flex>
      ) : (
        <Flex direction="column" alignItems="center" className="gap-2">
          {data.repos.map((repo) => (
            <Typography
              key={repo.id}
              variant="large"
              onClick={() => navigate(orgUri(org, `/${repo.name}`))}
              link
            >
              {repo.name}
            </Typography>
          ))}
        </Flex>
      )}
    </Container>
  );
};

export default Repos;
