import { lazy } from 'react';

import { Route } from 'shared';

const routes = [
  {
    Component: lazy(() => import('users/views/UserSettingsGeneral')),
    path: '/general',
  },
] satisfies Route[];

export default routes;
