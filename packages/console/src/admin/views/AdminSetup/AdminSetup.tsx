import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { isProduction } from 'env';

import { Loader, RoutesLoader, Typography } from 'shared';

import { useApp } from 'app';

import routes from './routes';
import { AdminSetupProps } from './types';

import { Container } from './AdminSetup.styles';

const AdminSetup: React.FC<AdminSetupProps> = () => {
  const { app } = useApp();

  const location = useLocation();

  if (location.pathname === '/admin/setup') {
    return <Navigate to="/admin/setup/code" replace />;
  }

  // If in production and cloud
  if (isProduction && app.cloud) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container>
      <Typography variant="title4">
        {!isProduction ? 'Development' : 'Self-hosted'} Setup
      </Typography>
      <RoutesLoader fallback={<Loader />} routes={routes} />
    </Container>
  );
};

export default AdminSetup;
