import { lazy } from 'react';

import { routes as orgsRoutes } from 'orgs';
import { routes as usersRoutes } from 'users';
import type { Route } from 'shared';

const routes = [
  {
    Component: lazy(() => import('views/DeepLink')),
    path: '$/*',
  },
  ...usersRoutes,
  ...orgsRoutes,
] as Route[];

export default routes;
