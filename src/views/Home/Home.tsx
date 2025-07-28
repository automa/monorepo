import React from 'react';

import { Flex } from 'shared';

import { Container } from './Home.styles';

const Home: React.FC = () => {
  return (
    <Container>
      <Flex direction="column" alignItems="center" className="gap-2">
        <Flex className="pb-4">Home</Flex>
      </Flex>
    </Container>
  );
};

export default Home;
