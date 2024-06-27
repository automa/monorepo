import { lazy } from 'react';

import { Route } from 'shared';

const routes = [
  {
    Component: lazy(() => import('users/views/UserSettingsGeneral')),
    path: '/general',
  },
  {
    Component: lazy(() => import('users/views/UserSettingsConnections')),
    path: '/connections',
  },
] satisfies Route[];

export default routes;
