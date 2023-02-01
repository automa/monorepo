import { lazy } from 'react';

import { Route } from 'shared';

export const routes = [
  {
    Component: lazy(() => import('auth/views/AuthLogin')),
    path: '/auth/login',
  },
] as Route[];
