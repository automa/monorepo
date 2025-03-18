import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { errors, ErrorType } from '@automa/common';

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
      // TODO: Use graphql (maybe dashboard query) here
      const { data } = await axios.create().get('/api/session');

      if (data) {
        setAuth({
          ...data,
          id: `${data.id}`,
        });
      }
    } catch {}

    setAuthLoading(false);
  }, []);

  useEffect(() => {
    const error = parseInt(
      new URLSearchParams(location.search).get('error') || '',
      10,
    );

    if (error) {
      toast({
        title: errors[error as ErrorType].message,
        variant: 'error',
      });
    }
  }, [location.search]);

  useEffect(() => {
    if (!user && !authLoading && location.pathname !== '/auth/login') {
      navigate('/auth/login', {
        state: { from: window.location.href },
      });
    }
  }, [user, authLoading, navigate, location]);

  useEffect(() => {
    identify(user);
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
