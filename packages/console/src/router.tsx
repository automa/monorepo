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
          Component: lazy(() => import('views/Dashboard')),
          children: [
            {
              path: 'account',
              Component: lazy(() => import('users/views/UserSettings')),
              children: [
                {
                  path: 'general',
                  Component: lazy(
                    () => import('users/views/UserSettingsGeneral'),
                  ),
                },
                {
                  path: 'connections',
                  Component: lazy(
                    () => import('users/views/UserSettingsConnections'),
                  ),
                },
              ],
            },
            {
              path: ':orgName',
              Component: lazy(() => import('orgs/views/Org')),
              children: [
                {
                  path: 'tasks',
                  children: [
                    {
                      index: true,
                      Component: lazy(() => import('tasks/views/Tasks')),
                    },
                    {
                      path: ':id',
                      Component: lazy(() => import('tasks/views/Task')),
                    },
                    {
                      path: 'new',
                      Component: lazy(() => import('tasks/views/TaskCreate')),
                    },
                  ],
                },
                {
                  path: 'repos',
                  children: [
                    {
                      index: true,
                      Component: lazy(() => import('repos/views/Repos')),
                    },
                    {
                      path: ':repoName',
                      Component: lazy(() => import('repos/views/Repo')),
                    },
                  ],
                },
                {
                  path: 'bots',
                  children: [
                    {
                      index: true,
                      Component: lazy(
                        () => import('bots/views/BotInstallations'),
                      ),
                    },
                    {
                      path: ':botOrgName/:botName',
                      Component: lazy(
                        () => import('bots/views/BotInstallation'),
                      ),
                    },
                    {
                      path: 'new',
                      children: [
                        {
                          index: true,
                          Component: lazy(
                            () => import('bots/views/PublicBots'),
                          ),
                        },
                        {
                          path: ':botOrgName/:botName',
                          Component: lazy(() => import('bots/views/PublicBot')),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: 'integrations',
                  Component: lazy(() => import('orgs/views/OrgIntegrations')),
                },
                {
                  path: 'settings',
                  Component: lazy(() => import('orgs/views/OrgSettings')),
                  children: [
                    {
                      path: 'bots',
                      children: [
                        {
                          index: true,
                          Component: lazy(() => import('bots/views/Bots')),
                        },
                        {
                          path: ':botName',
                          Component: lazy(() => import('bots/views/Bot')),
                        },
                        {
                          path: 'new',
                          Component: lazy(() => import('bots/views/BotCreate')),
                        },
                      ],
                    },
                    {
                      path: 'billing',
                      Component: lazy(
                        () => import('orgs/views/OrgSettingsBilling'),
                      ),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          path: 'integrations/setup/github',
          Component: lazy(
            () => import('integrations/views/IntegrationSetupGithub'),
          ),
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
        {
          path: 'admin',
          children: [
            {
              path: 'setup',
              Component: lazy(() => import('admin/views/AdminSetup')),
              children: [
                {
                  path: 'code',
                  Component: lazy(() => import('admin/views/AdminSetupCode')),
                },
                {
                  path: 'github',
                  Component: lazy(() => import('admin/views/AdminSetupGithub')),
                },
              ],
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
