import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAsyncEffect } from 'shared';

import { logout, useUser } from 'auth';

const AuthLogout: React.FC = () => {
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
    return <Navigate to="../login" />;
  }

  return null;
};

export default AuthLogout;
