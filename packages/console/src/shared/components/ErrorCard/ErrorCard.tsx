import React from 'react';

import Typography from '../Typography';

import { ErrorCardProps } from './types';

import { Container } from './ErrorCard.styles';

const ErrorCard: React.FC<ErrorCardProps> = ({ error, ...props }) => {
  return (
    <Container {...props}>
      <Typography variant="xsmall">
        {error?.message ?? 'Something went wrong'}
      </Typography>
    </Container>
  );
};

export default ErrorCard;
