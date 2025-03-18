import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAsyncEffect } from 'shared';

import { logout, useAuth, useUser } from 'auth';
import { useOrgs } from 'orgs';

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
    } catch {}

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
