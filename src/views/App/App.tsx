import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAnalytics } from 'analytics';
import { useOptimizerUser } from 'optimizer';
import { Loader, RoutesLoader, useAsyncEffect } from 'shared';

import { useAuth, useUser } from 'auth';

import routes from './routes';

import { Container } from './App.styles';

const App: React.FC<{}> = () => {
  const { identify } = useAnalytics();

  const { updateOptimizerUser } = useOptimizerUser();

  const { setAuth, setAuthLoading, authLoading } = useAuth();

  const user = useUser();

  const navigate = useNavigate();

  useAsyncEffect(async () => {
    try {
      const { data } = await Promise.resolve({
        data: {
          id: 'fixme',
          email: 'fixme',
          org_id: 'fixme',
        },
      });

      if (data) {
        setAuth(data);
      }
    } catch (_) {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/auth/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    identify(user);
  }, [identify, user]);

  useEffect(() => {
    updateOptimizerUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Container>
      {!authLoading && <RoutesLoader fallback={<Loader />} routes={routes} />}
    </Container>
  );
};

export default App;
