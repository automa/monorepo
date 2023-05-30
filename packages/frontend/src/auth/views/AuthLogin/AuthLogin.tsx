import React from 'react';
import { Navigate } from 'react-router-dom';

import { Button } from 'shared';
import { useUser } from 'auth/hooks';

import { AuthLoginProps } from './types';

import { Container } from './AuthLogin.styles';

const AuthLogin: React.FC<AuthLoginProps> = ({ ...props }) => {
  const user = useUser();

  if (user) {
    return <Navigate to="/" />;
  }

  const loginWithGithub = () => {
    window.location.href = `${process.env.REACT_APP_API_URI}/auth/github?from=${window.location.href}`;
  };

  return (
    <Container {...props}>
      <Button onClick={loginWithGithub}>Connect with GitHub</Button>
    </Container>
  );
};

export default AuthLogin;
