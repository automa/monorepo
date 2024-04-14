import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { Flex, Typography } from 'shared';

import { OrgOverviewProps } from './types';

import { REPOS_QUERY } from './OrgOverview.queries';
import { Container } from './OrgOverview.styles';

const OrgOverview: React.FC<OrgOverviewProps> = ({ org, ...props }) => {
  const navigate = useNavigate();

  // TODO: Add infinite scroll
  const { data, loading } = useQuery(REPOS_QUERY, {
    variables: {
      provider_type: org.provider_type,
      name: org.name,
    },
  });

  return (
    <Container {...props}>
      <Flex direction="column" alignItems="center" className="gap-2">
        {loading && !data ? (
          <div>Loading</div>
        ) : !data?.org?.repos ? (
          <div>Not found</div>
        ) : !data?.org?.repos?.length ? (
          <div>No repos</div>
        ) : (
          data.org.repos.map((repo) => (
            <Typography
              key={repo.id}
              variant="large"
              onClick={() =>
                navigate(`/${org.provider_type}/${org.name}/${repo.name}`)
              }
              link
            >
              {repo.name}
            </Typography>
          ))
        )}
      </Flex>
    </Container>
  );
};

export default OrgOverview;
