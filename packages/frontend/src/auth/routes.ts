import { lazy } from 'react';

import { Route } from 'shared';

const routes = [
  {
    Component: lazy(() => import('auth/views/AuthLogin')),
    path: '/auth/login',
  },
] as Route[];

export default routes;
