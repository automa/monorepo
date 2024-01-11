import { lazy } from 'react';

import { routes as authRoutes } from 'auth';
import type { Route } from 'shared';

const routes = [
  ...authRoutes,
  {
    Component: lazy(() => import('views/Dashboard')),
    path: '/*',
  },
] as Route[];

export default routes;
