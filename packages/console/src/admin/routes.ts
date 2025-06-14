import { lazy } from 'react';

import { Route } from 'shared';

export const routes = [
  {
    Component: lazy(() => import('admin/views/AdminSetup')),
    path: '/admin/setup/*',
  },
] satisfies Route[];
