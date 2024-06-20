import { lazy } from 'react';

import { Route } from 'shared';

import { routes as botRoutes } from 'bots';
import { routes as repoRoutes } from 'repos';
import { routes as taskRoutes } from 'tasks';

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
] satisfies Route[];

export default routes;
