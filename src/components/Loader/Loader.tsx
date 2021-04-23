import React from 'react';

import { Container } from './Loader.styles';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const Loader: React.FC<LoaderProps> = ({ ...props }) => {
  return <Container {...props}>Loading...</Container>;
};

Loader.displayName = 'Loader';

export default Loader;
