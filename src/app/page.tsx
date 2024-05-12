import React from 'react';

import { Flex } from 'components';

import { Container } from './page.styles';

const AppPage: React.FC = () => {
  return (
    <Container>
      <Flex direction="column" alignItems="center" className="gap-2">
        <Flex className="pb-4">Home</Flex>
      </Flex>
    </Container>
  );
};

export default AppPage;
