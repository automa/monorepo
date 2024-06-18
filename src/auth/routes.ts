import { lazy } from 'react';

import type { Route } from 'shared';

export const routes = [
  {
    Component: lazy(() => import('auth/views/AuthLogin')),
    path: '/auth/login',
  },
  {
    Component: lazy(() => import('auth/views/AuthLogout')),
    path: '/auth/logout',
  },
] satisfies Route[];
