import React from 'react';

import Loader from 'components/Loader';
import RoutesLoader from 'components/RoutesLoader';

import routes from './routes';

import { Container } from './App.styles';

export interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <Container>
      <RoutesLoader fallback={<Loader />} routes={routes} />
    </Container>
  );
};

export default App;
