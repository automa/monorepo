import { lazy } from 'react';

import { Route } from 'shared';

export const setupRoutes = [
  {
    Component: lazy(() => import('integrations/views/IntegrationSetupGithub')),
    path: '/integrations/setup/github',
  },
] satisfies Route[];
