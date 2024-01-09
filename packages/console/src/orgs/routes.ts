import { lazy } from 'react';

import { Route } from 'shared';

export const routes = [
  {
    Component: lazy(() => import('orgs/views/OrgList')),
    path: '/',
  },
  {
    Component: lazy(() => import('orgs/views/OrgOverview')),
    path: '/orgs/:provider/:orgName',
  },
  {
    Component: lazy(
      () => import('orgs/views/OrgIntegrations/OrgIntegrationsProjects'),
    ),
    path: '/orgs/:provider/:orgName/integrations/projects',
  },
] as Route[];
