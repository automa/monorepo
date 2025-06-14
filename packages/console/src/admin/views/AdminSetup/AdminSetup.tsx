import React from 'react';
import { Navigate } from 'react-router-dom';

import { isProduction } from 'env';

import { Loader, RoutesLoader, Typography, useRelativeMatch } from 'shared';

import { useApp } from 'app';

import routes from './routes';
import { AdminSetupProps } from './types';

import { Container } from './AdminSetup.styles';

const AdminSetup: React.FC<AdminSetupProps> = () => {
  const { app } = useApp();

  const isAdminSetupView = useRelativeMatch('.');

  if (isAdminSetupView) {
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
