import { lazy } from 'react';

import { Route } from 'shared';

import { routes as authRoutes } from 'auth';
import { setupRoutes as integrationsSetupRoutes } from 'integrations';

const routes = [
  ...authRoutes,
  ...integrationsSetupRoutes,
  {
    Component: lazy(() => import('views/Dashboard')),
    path: '/*',
  },
] satisfies Route[];

export default routes;
