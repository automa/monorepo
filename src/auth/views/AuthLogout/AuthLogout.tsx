import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAsyncEffect } from 'shared';

import { logout, useAuth, useUser } from 'auth';

import { AuthLogoutProps } from './types';

import { Container } from './AuthLogout.styles';

const AuthLogout: React.FC<AuthLogoutProps> = () => {
  const user = useUser();

  const { setAuthLoading } = useAuth();

  useAsyncEffect(async () => {
    if (!user) {
      return;
    }

    setAuthLoading(true);

    try {
      await logout();
    } catch {}

    setAuthLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <Container></Container>;
};

export default AuthLogout;
