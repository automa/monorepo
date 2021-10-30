import React from 'react';

import { Container } from './Home.styles';

export interface HomeProps extends React.HTMLAttributes<HTMLDivElement> {}

const Home: React.FC<HomeProps> = ({ ...props }) => {
  return <Container {...props}>Home</Container>;
};

export default Home;
