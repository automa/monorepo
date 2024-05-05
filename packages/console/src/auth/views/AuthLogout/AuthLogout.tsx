import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

import { useOrgs } from 'orgs';
import { useAsyncEffect } from 'shared';

import { useUser, useAuth } from 'auth/hooks';

import { AuthLogoutProps } from './types';

import { Container } from './AuthLogout.styles';

const AuthLogout: React.FC<AuthLogoutProps> = ({ ...props }) => {
  const user = useUser();

  const { unsetAuth, setAuthLoading } = useAuth();
  const { unsetOrgs, setOrgsLoading } = useOrgs();

  useAsyncEffect(async () => {
    if (!user) {
      return;
    }

    setAuthLoading(true);
    setOrgsLoading(true);

    try {
      await axios('/auth/logout');
      unsetAuth();
      unsetOrgs();
    } catch (_) {}

    setAuthLoading(false);
    setOrgsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <Container {...props}></Container>;
};

export default AuthLogout;
