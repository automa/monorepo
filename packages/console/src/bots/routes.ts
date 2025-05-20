import { lazy } from 'react';

import { Route } from 'shared';

export const routes = [
  {
    Component: lazy(() => import('bots/views/PublicBots')),
    path: '/bots/new',
  },
  {
    Component: lazy(() => import('bots/views/PublicBot')),
    path: '/bots/new/:botOrgName/:botName',
  },
  {
    Component: lazy(() => import('bots/views/BotInstallations')),
    path: '/bots',
  },
  {
    Component: lazy(() => import('bots/views/BotInstallation')),
    path: '/bots/:botOrgName/:botName',
  },
] satisfies Route[];
