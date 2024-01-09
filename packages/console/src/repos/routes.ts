import { lazy } from 'react';

import { Route } from 'shared';

export const routes = [
  {
    Component: lazy(() => import('repos/views/RepoOverview')),
    path: '/orgs/:provider/:orgName/repos/:repoName',
  },
] as Route[];
