import React from 'react';

import { LinkComponentProps } from './types';

import { Container, Text } from './Link.styles';

const Link: React.FC<LinkComponentProps> = ({ to, ...props }) => {
  return (
    <Container to={to}>
      <Text {...props} link />
    </Container>
  );
};

export default Link;
