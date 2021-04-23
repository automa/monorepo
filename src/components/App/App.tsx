import React, { Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Loader from 'components/Loader';

import { Container } from './App.styles';

export interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <Container>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route path="/">Home</Route>
          </Switch>
        </Suspense>
      </BrowserRouter>
    </Container>
  );
};

App.displayName = 'App';

export default App;
