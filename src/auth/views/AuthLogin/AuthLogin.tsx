import React from 'react';
import { Navigate } from 'react-router-dom';

import { useUser } from 'auth';

import { Container } from './AuthLogin.styles';

const AuthLogin: React.FC = () => {
  const user = useUser();

  if (user) {
    return <Navigate to="/" />;
  }

  return <Container>Login</Container>;
};

export default AuthLogin;
