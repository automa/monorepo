import { lazy } from 'react';

import { Route } from 'shared';

export const routes = [
  {
    Component: lazy(() => import('tasks/views/TaskCreate')),
    path: '/tasks/new',
  },
  {
    Component: lazy(() => import('tasks/views/Tasks')),
    path: '/tasks',
  },
] as Route[];
