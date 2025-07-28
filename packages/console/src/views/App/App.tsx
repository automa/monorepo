import React, { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { errors, ErrorType } from '@automa/common';

import { useAnalytics } from 'analytics';
import { useOptimizerUser } from 'optimizer';
import { Loader, toast } from 'shared';

import { useApp } from 'app';
import { useAuth, useUser } from 'auth';

import { APP_QUERY } from './App.queries';
import { Container } from './App.styles';

const App: React.FC = () => {
  const { identify } = useAnalytics();

  const { updateOptimizerUser } = useOptimizerUser();

  const { setApp } = useApp();

  const { setAuth } = useAuth();

  const user = useUser();

  const navigate = useNavigate();

  const location = useLocation();

  const { data, loading } = useQuery(APP_QUERY);

  useEffect(() => {
    if (data?.app) {
      setApp(data.app);
    }

    if (data?.user) {
      setAuth({
        ...data.user,
        id: `${data.user.id}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    const isNonAuthRoute = [/^\/auth\/login$/, /^\/admin\/setup(\/.*)?$/].some(
      (p) => p.test(location.pathname),
    );

    if (!data?.user && !loading && !isNonAuthRoute) {
      navigate('auth/login', {
        state: { from: window.location.href },
      });
    }
  }, [data?.user, loading, navigate, location]);

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
    identify(user);
    updateOptimizerUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </Container>
  );
};

export default App;
