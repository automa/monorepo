import React from 'react';
import { Navigate } from 'react-router-dom';

import { useUser } from 'auth/hooks';

import { AuthLoginProps } from './types';

import { Container } from './AuthLogin.styles';

const AuthLogin: React.FC<AuthLoginProps> = () => {
  const user = useUser();

  if (user) {
    return <Navigate to="/" />;
  }

  return <Container></Container>;
};

export default AuthLogin;
