import { lazy } from 'react';

import { Route } from 'shared';

const routes = [
  {
    Component: lazy(() => import('repos/views/RepoOverview')),
    path: '/',
  },
] satisfies Route[];

export default routes;
