import { lazy } from 'react';

import { routes as taskRoutes } from 'tasks';
import { routes as repoRoutes } from 'repos';
import { routes as botRoutes } from 'bots';
import { Route } from 'shared';

const routes = [
  {
    Component: lazy(() => import('orgs/views/OrgIntegrations')),
    path: '/integrations',
  },
  {
    Component: lazy(() => import('orgs/views/OrgSettings')),
    path: '/settings/*',
  },
  ...taskRoutes,
  ...repoRoutes,
  ...botRoutes,
] as Route[];

export default routes;
