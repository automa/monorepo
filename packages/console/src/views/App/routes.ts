import { lazy } from 'react';

import { Route } from 'shared';

import { routes as authRoutes } from 'auth';

const routes = [
  ...authRoutes,
  {
    Component: lazy(() => import('views/Dashboard')),
    path: '/*',
  },
] satisfies Route[];

export default routes;
