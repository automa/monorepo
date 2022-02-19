import React from 'react';

import { LoaderProps } from './types';

import { Container } from './Loader.styles';

const Loader: React.FC<LoaderProps> = ({ ...props }) => {
  return <Container {...props}>Loading...</Container>;
};

Loader.displayName = 'Loader';

export default Loader;
