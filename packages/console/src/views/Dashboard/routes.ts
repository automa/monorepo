import { lazy } from 'react';

import { Route } from 'shared';

import { routes as orgsRoutes } from 'orgs/routes';
import { routes as usersRoutes } from 'users/routes';

const routes = [
  {
    Component: lazy(() => import('views/DeepLink')),
    path: '$/*',
  },
  ...usersRoutes,
  ...orgsRoutes,
] satisfies Route[];

export default routes;
