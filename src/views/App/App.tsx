import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Loader from 'components/Loader';
import RoutesLoader from 'components/RoutesLoader';

import routes from './routes';
import { Container } from './App.styles';

export interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <Container>
      <BrowserRouter>
        <RoutesLoader fallback={<Loader />} routes={routes} />
      </BrowserRouter>
    </Container>
  );
};

export default App;
