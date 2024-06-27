import { lazy } from 'react';

import { Route } from 'shared';

export const routes = [
  {
    Component: lazy(() => import('users/views/UserSettings')),
    path: 'account/*',
  },
] satisfies Route[];
