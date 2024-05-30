import React from 'react';
import { Navigate } from 'react-router-dom';

import { useOrgs } from 'orgs';
import { useAsyncEffect } from 'shared';

import { useUser, useAuth } from 'auth/hooks';

import { logout } from '../../utils';

import { AuthLogoutProps } from './types';

const AuthLogout: React.FC<AuthLogoutProps> = () => {
  const user = useUser();

  const { setAuthLoading } = useAuth();
  const { setOrgsLoading } = useOrgs();

  useAsyncEffect(async () => {
    if (!user) {
      return;
    }

    setAuthLoading(true);
    setOrgsLoading(true);

    try {
      await logout();
    } catch (_) {}

    setAuthLoading(false);
    setOrgsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return null;
};

export default AuthLogout;
