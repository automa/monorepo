import React from 'react';

import Typography from '../Typography';

import { ErrorCardComponentProps } from './types';

import { Container } from './ErrorCard.styles';

const ErrorCard: React.FC<ErrorCardComponentProps> = ({ error, ...props }) => {
  return (
    <Container {...props}>
      <Typography variant="body3">
        {error?.message ?? 'Something went wrong'}
      </Typography>
    </Container>
  );
};

export default ErrorCard;
