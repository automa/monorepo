import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Loader, RoutesLoader, useAsyncEffect } from 'shared';
import { useAuth, useUser } from 'auth';

import routes from './routes';

import { Container } from './App.styles';

export interface AppProps {}

const App: React.FC<AppProps> = () => {
  const { setAuth, unsetAuth, setAuthLoading, authLoading } = useAuth();

  const user = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          unsetAuth();
        }

        return Promise.reject(error);
      },
    );
  }, [unsetAuth]);

  useAsyncEffect(async () => {
    try {
      const { data } = await axios('/api/session');

      if (!!data) {
        setAuth(data);
      }
    } catch (_) {}

    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/auth/login');
    }
  }, [user, authLoading, navigate]);

  return (
    <Container>
      {!authLoading && <RoutesLoader fallback={<Loader />} routes={routes} />}
    </Container>
  );
};

export default App;
