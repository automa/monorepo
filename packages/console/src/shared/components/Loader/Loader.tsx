import React from 'react';

import Loading from 'assets/loading.webp';

import { LoaderProps } from './types';

import { Container } from './Loader.styles';

const Loader: React.FC<LoaderProps> = ({ ...props }) => {
  return (
    <Container {...props}>
      <img className="size-20" src={Loading} alt="loading" />
    </Container>
  );
};

export default Loader;
