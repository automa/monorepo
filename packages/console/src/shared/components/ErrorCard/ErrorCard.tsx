import React from 'react';
import { useRouteError } from 'react-router-dom';
import { getErrorMessage } from 'react-error-boundary';

import Typography from '../Typography';

import { ErrorCardProps } from './types';

import { Container } from './ErrorCard.styles';

const ErrorCard: React.FC<ErrorCardProps> = ({ error, ...props }) => {
  const routeError = useRouteError() as any;
  const message = getErrorMessage(error);

  return (
    <Container {...props}>
      <Typography variant="xsmall">
        {message ?? routeError?.message ?? 'Something went wrong'}
      </Typography>
    </Container>
  );
};

export default ErrorCard;
