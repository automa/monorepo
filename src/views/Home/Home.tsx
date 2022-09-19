import React from 'react';

import { Flex } from 'shared';

import { HomeProps } from './types';

import { Container } from './Home.styles';

const Home: React.FC<HomeProps> = ({ ...props }) => {
  return (
    <Container {...props}>
      <Flex direction="column" alignItems="center" gap={1}>
        <Flex paddingBottom={2}>Hello</Flex>
        <div>This is your homepage.</div>
        <div>You can replace this text in code.</div>
      </Flex>
    </Container>
  );
};

export default Home;
