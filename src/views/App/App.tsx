import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Loader from 'components/Loader';
import RoutesLoader from 'components/RoutesLoader';

import routes from './routes';

export interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <BrowserRouter>
      <RoutesLoader fallback={<Loader />} routes={routes} />
    </BrowserRouter>
  );
};

export default App;
