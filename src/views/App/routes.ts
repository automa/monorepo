import { lazy } from 'react';
import { Route } from 'types';

const routes = [
  {
    Component: lazy(() => import('views/Home')),
    path: '',
  },
] as Route[];

export default routes;
