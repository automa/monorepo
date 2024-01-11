import { lazy } from 'react';

import { Route } from 'shared';

export const routes = [
  {
    Component: lazy(() => import('repos/views/Repo')),
    path: ':provider/:orgName/:repoName/*',
  },
] as Route[];
