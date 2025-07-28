import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { ErrorCard } from 'shared';

const router = createBrowserRouter(
  [
    {
      Component: lazy(() => import('views/App')),
      errorElement: (
        <ErrorCard error={undefined} resetErrorBoundary={() => {}} />
      ),
      children: [
        {
          path: '',
          Component: lazy(() => import('views/Home')),
        },
        {
          path: 'auth',
          children: [
            {
              path: 'login',
              Component: lazy(() => import('auth/views/AuthLogin')),
            },
            {
              path: 'logout',
              Component: lazy(() => import('auth/views/AuthLogout')),
            },
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

export default router;
