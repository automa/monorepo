import React from 'react';

import { CommonWrapper } from 'theme';

import Typography from 'shared/components/Typography';

import { LinkProps } from './types';

import { Container } from './Link.styles';

const Link = CommonWrapper<LinkProps>(({ to, ...props }) => {
  return (
    <Container to={to}>
      <Typography {...props} link />
    </Container>
  );
});

export default Link;
