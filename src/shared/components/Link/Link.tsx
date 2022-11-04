import React from 'react';

import { CommonWrapper } from 'theme';

import Typography from 'shared/components/Typography';

import { LinkComponentProps } from './types';

import { Container } from './Link.styles';

const Link = CommonWrapper<LinkComponentProps>(
  ({ to, activeColor, ...props }) => {
    return (
      <Container $activeColor={activeColor} to={to}>
        <Typography {...props} link />
      </Container>
    );
  },
);

export default Link;
