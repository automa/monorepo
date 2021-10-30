import { lazy } from 'react';
import { Route } from 'types';

const routes = [
  {
    Component: lazy(() => import('views/Home')),
    path: '/',
    exact: true,
  },
] as Route[];

export default routes;
