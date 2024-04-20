import { lazy } from 'react';

import { routes as repoRoutes } from 'repos';
import { Route } from 'shared';

const routes = [
  {
    Component: lazy(() => import('orgs/views/OrgIntegrations')),
    path: '/integrations',
  },
  ...repoRoutes,
] as Route[];

export default routes;
