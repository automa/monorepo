import { lazy } from 'react';

import { Route } from 'shared';

const routes = [
  {
    Component: lazy(() => import('admin/views/AdminSetupCode')),
    path: '/code',
  },
  {
    Component: lazy(() => import('admin/views/AdminSetupGithub')),
    path: '/github',
  },
] satisfies Route[];

export default routes;
