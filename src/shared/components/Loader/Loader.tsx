import React from 'react';

import { LoaderComponentProps } from './types';

import { Container } from './Loader.styles';

const Loader: React.FC<LoaderComponentProps> = ({ size, ...props }) => {
  return (
    <Container $size={size} {...props}>
      Loading...
    </Container>
  );
};

export default Loader;
