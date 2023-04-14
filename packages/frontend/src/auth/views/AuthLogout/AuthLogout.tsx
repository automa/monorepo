import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

import { useUser, useAuth } from 'auth/hooks';
import { useAsyncEffect } from 'shared';

import { AuthLogoutProps } from './types';

import { Container } from './AuthLogout.styles';

const AuthLogout: React.FC<AuthLogoutProps> = ({ ...props }) => {
  const user = useUser();

  const { unsetAuth, setAuthLoading } = useAuth();

  useAsyncEffect(async () => {
    if (!user) {
      return;
    }

    setAuthLoading(true);

    try {
      await axios('/auth/logout');
      unsetAuth();
    } catch (_) {}

    setAuthLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) {
    return <Navigate to="/" />;
  }

  return <Container {...props}></Container>;
};

export default AuthLogout;
