import { lazy } from 'react';

import { Route } from 'shared';

export const routes = [
  {
    Component: lazy(() => import('orgs/views/Org')),
    path: ':provider/:orgName/*',
  },
] as Route[];
