import React from 'react';

import { Flex } from 'shared';

import { HomeProps } from './types';

import { Container } from './Home.styles';

const Home: React.FC<HomeProps> = ({ ...props }) => {
  return (
    <Container {...props}>
      <Flex direction="column" alignItems="center" gap={1}>
        <Flex paddingBottom={2}>Home</Flex>
      </Flex>
    </Container>
  );
};

export default Home;
