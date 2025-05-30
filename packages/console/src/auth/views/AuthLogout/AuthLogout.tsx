import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAsyncEffect } from 'shared';

import { logout, useUser } from 'auth';

import { AuthLogoutProps } from './types';

const AuthLogout: React.FC<AuthLogoutProps> = () => {
  const user = useUser();

  useAsyncEffect(async () => {
    if (!user) {
      return;
    }

    try {
      await logout();
    } catch {}
  }, [user]);

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return null;
};

export default AuthLogout;
