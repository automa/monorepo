import React from 'react';
import { useQuery } from '@apollo/client';

import { Flex } from 'shared';

import { HomeProps } from './types';
import { GET_ORGS } from './queries';

import { Container } from './Home.styles';

const Home: React.FC<HomeProps> = ({ ...props }) => {
  const { data, loading } = useQuery(GET_ORGS);

  return (
    <Container {...props}>
      <Flex direction="column" alignItems="center" gap={1}>
        <Flex paddingBottom={2}>Dashboard</Flex>
        {loading && <div>Loading...</div>}
        {data && (
          <div>
            {data.orgs.map((org: any) => (
              <div key={org.id}>{org.name}</div>
            ))}
          </div>
        )}
      </Flex>
    </Container>
  );
};

export default Home;
