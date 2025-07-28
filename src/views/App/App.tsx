import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAnalytics } from 'analytics';
import { useOptimizerUser } from 'optimizer';
import { Loader, RoutesLoader, toast, useAsyncEffect } from 'shared';

import { useAuth, useUser } from 'auth';

import routes from './routes';

import { Container } from './App.styles';

const App: React.FC<{}> = () => {
  const { identify } = useAnalytics();

  const { updateOptimizerUser } = useOptimizerUser();

  const { setAuth, setAuthLoading, authLoading } = useAuth();

  const user = useUser();

  const navigate = useNavigate();

  const location = useLocation();

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
    } catch {}

    setAuthLoading(false);
  }, []);

  useEffect(() => {
    const isNonAuthRoute = [/^\/auth\/login$/].some((p) =>
      p.test(location.pathname),
    );

    if (!user && !authLoading && !isNonAuthRoute) {
      navigate('/auth/login', {
        state: { from: window.location.href },
      });
    }
  }, [user, authLoading, navigate, location]);

  useEffect(() => {
    const error = parseInt(
      new URLSearchParams(location.search).get('error') || '',
      10,
    );

    if (error) {
      toast({
        title: `${error}`,
        variant: 'error',
      });
    }
  }, [location.search]);

  useEffect(() => {
    identify(user);
    updateOptimizerUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (authLoading) {
    return <Loader />;
  }

  return (
    <Container>
      <RoutesLoader fallback={<Loader />} routes={routes} />
    </Container>
  );
};

export default App;
