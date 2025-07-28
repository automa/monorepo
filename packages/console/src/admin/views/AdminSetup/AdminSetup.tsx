import React, { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { isProduction } from 'env';

import { Loader, Typography, useRelativeMatch } from 'shared';

import { useApp } from 'app';

import { Container } from './AdminSetup.styles';

const AdminSetup: React.FC = () => {
  const { app } = useApp();

  const isAdminSetupView = useRelativeMatch('.');

  if (isAdminSetupView) {
    return <Navigate to="code" replace />;
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
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </Container>
  );
};

export default AdminSetup;
