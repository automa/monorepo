import { lazy } from 'react';

import { Route } from 'shared';

const routes = [
  {
    Component: lazy(() => import('repos/views/RepoOverview')),
    path: '/',
  },
] as Route[];

export default routes;
