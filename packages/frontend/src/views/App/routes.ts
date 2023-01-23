import { lazy } from 'react';

import { Route } from 'shared';

const routes = [
  {
    Component: lazy(() => import('views/Home')),
    path: '',
  },
] as Route[];

export default routes;
