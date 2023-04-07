import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Loader, RoutesLoader, useAsyncEffect } from 'shared';
import { useAuth, useUser } from 'auth';

import routes from './routes';

import { Container } from './App.styles';

export interface AppProps {}

const App: React.FC<AppProps> = () => {
  const { setAuth, setAuthLoading, authLoading } = useAuth();

  const user = useUser();

  const navigate = useNavigate();

  useAsyncEffect(async () => {
    try {
      const { data } = await Promise.resolve({ data: { id: 'fixme' } });

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
