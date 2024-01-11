import { lazy } from 'react';

import { Route } from 'shared';

const routes = [
  {
    Component: lazy(() => import('orgs/views/OrgOverview')),
    path: '/',
  },
  {
    Component: lazy(() => import('orgs/views/OrgIntegrations')),
    path: '~/integrations/projects',
  },
] as Route[];

export default routes;
