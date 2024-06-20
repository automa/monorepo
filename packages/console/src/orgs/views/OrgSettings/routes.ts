import { lazy } from 'react';

import { Route } from 'shared';

const routes = [
  {
    Component: lazy(() => import('orgs/views/OrgSettingsBilling')),
    path: '/billing',
  },
  {
    Component: lazy(() => import('bots/views/BotCreate')),
    path: '/bots/new',
  },
  {
    Component: lazy(() => import('bots/views/Bots')),
    path: '/bots',
  },
] satisfies Route[];

export default routes;
