import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';

import { isProduction } from 'env';

import { Flex, Tooltip, Typography } from 'shared';

import { useApp } from 'app';

import GithubLogo from 'assets/logos/github.svg?react';

import { AdminSetupCodeProps } from './types';

import { Card, Container } from './AdminSetupCode.styles';

const AdminSetupCode: React.FC<AdminSetupCodeProps> = () => {
  const { app } = useApp();

  const needsRepositorySetup =
    !app.integrations.github && !app.integrations.gitlab;

  const githubManifest = useMemo(
    () =>
      JSON.stringify({
        name: `Automa ${!isProduction ? 'Development' : 'Self-hosted'}`,
        description: `Automa ${
          !isProduction ? 'development' : 'self-hosted'
        } integration`,
        url: app.client_uri,
        public: false,
        request_oauth_on_install: false,
        setup_on_update: false,
        hook_attributes: {
          url: 'https://example.com/hooks/github',
          active: true,
        },
        redirect_url: `${app.client_uri}/admin/setup/github`,
        callback_urls: [`${import.meta.env.VITE_API_URI}/callbacks/github`],
        setup_url: `${app.client_uri}/integrations/setup/github`,
        default_permissions: {
          contents: 'write',
          emails: 'read',
          issues: 'write',
          members: 'read',
          metadata: 'read',
          organization_projects: 'read',
          pull_requests: 'write',
          repository_projects: 'read',
          workflows: 'write',
        },
        default_events: [
          'issues',
          'issue_comment',
          'organization',
          'projects_v2_item',
          'public',
          'pull_request',
          'pull_request_review',
          'pull_request_review_comment',
          'push',
          'repository',
        ],
      }),
    [app],
  );

  // If no repository setup is needed,
  if (!needsRepositorySetup) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container>
      <form method="POST" action="https://github.com/settings/apps/new">
        <Tooltip body="Create GitHub app" side="bottom" sideOffset={12}>
          <Card type="submit">
            <input type="hidden" name="manifest" value={githubManifest} />
            <Flex direction="column" alignItems="center" className="gap-6">
              <GithubLogo className="size-16" />
              <Typography variant="large">GitHub</Typography>
            </Flex>
          </Card>
        </Tooltip>
      </form>
    </Container>
  );
};

export default AdminSetupCode;
