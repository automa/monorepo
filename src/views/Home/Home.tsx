import React from 'react';

import { HomeProps } from './types';

import { Container } from './Home.styles';

const Home: React.FC<HomeProps> = ({ ...props }) => {
  return <Container {...props}>Home</Container>;
};

export default Home;
