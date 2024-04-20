import { lazy } from 'react';

import { Route } from 'shared';

const routes = [
  {
    Component: lazy(() => import('orgs/views/OrgSettingsBilling')),
    path: '/billing',
  },
  {
    Component: lazy(() => import('orgs/views/OrgSettingsBots')),
    path: '/bots',
  },
] as Route[];

export default routes;
