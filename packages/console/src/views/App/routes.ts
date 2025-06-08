import { lazy } from 'react';

import { Route } from 'shared';

import { routes as authRoutes } from 'auth/routes';
import { setupRoutes as integrationsSetupRoutes } from 'integrations/routes';

const routes = [
  ...authRoutes,
  ...integrationsSetupRoutes,
  {
    Component: lazy(() => import('views/Dashboard')),
    path: '/*',
  },
] satisfies Route[];

export default routes;
