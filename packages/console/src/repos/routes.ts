import { lazy } from 'react';

import { Route } from 'shared';

export const routes = [
  {
    Component: lazy(() => import('repos/views/Repos')),
    path: '/repos',
  },
  {
    Component: lazy(() => import('repos/views/Repo')),
    path: '/repos/:repoName/*',
  },
] satisfies Route[];
