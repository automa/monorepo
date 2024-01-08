import React, { useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Button } from 'shared';
import { useUser } from 'auth/hooks';

import { AuthLoginProps } from './types';

import { Container } from './AuthLogin.styles';

const AuthLogin: React.FC<AuthLoginProps> = ({ ...props }) => {
  const user = useUser();

  const location = useLocation();

  const loginWithGithub = useCallback(() => {
    const referer = (location.state as { from?: string })?.from;

    window.location.href = `${import.meta.env.VITE_API_URI}/auth/github${
      referer ? `?from=${referer}` : ''
    }`;
  }, [location]);

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Container {...props}>
      <Button onClick={loginWithGithub}>Connect with GitHub</Button>
    </Container>
  );
};

export default AuthLogin;
