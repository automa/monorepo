import React from 'react';
import { useRouteError } from 'react-router-dom';

import Typography from '../Typography';

import { ErrorCardProps } from './types';

import { Container } from './ErrorCard.styles';

const ErrorCard: React.FC<ErrorCardProps> = ({ error, ...props }) => {
  const routeError = useRouteError() as any;

  return (
    <Container {...props}>
      <Typography variant="xsmall">
        {error?.message ?? routeError?.message ?? 'Something went wrong'}
      </Typography>
    </Container>
  );
};

export default ErrorCard;
