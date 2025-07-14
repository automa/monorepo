import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import { Anchor, Flex, Loader, Typography, useAsyncEffect } from 'shared';

import { AdminSetupGithubProps } from './types';

import { Name, Secret } from './AdminSetupGithub.styles';

const AdminSetupGithub: React.FC<AdminSetupGithubProps> = () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');

  const [secrets, setSecrets] = useState<{
    slug: string;
    client_id: string;
    client_secret: string;
    pem: string;
    webhook_secret: string;
  } | null>(null);
  const [error, setError] = useState(false);

  useAsyncEffect(async () => {
    if (!code) return;

    if (secrets) return;

    try {
      const { data } = await axios
        .create({
          baseURL: 'https://api.github.com',
          withCredentials: false,
        })
        .post(
          `/app-manifests/${code}/conversions`,
          {},
          {
            headers: {
              Accept: 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28',
            },
          },
        );

      if (data) {
        setSecrets(data);
      }
    } catch (error: any) {
      if (error.message !== 'Request failed with status code 500') {
        setError(true);
      }
    }
  }, [code, secrets]);

  if (!code) {
    return (
      <Typography className="text-red-600">Missing GitHub App code.</Typography>
    );
  }

  if (error) {
    return (
      <Typography className="text-red-600">
        Failed to fetch GitHub App secrets.
      </Typography>
    );
  }

  if (!secrets) {
    return (
      <Flex direction="column" className="gap-6">
        <Typography>Fetching GitHub App secrets...</Typography>
        <Loader />
      </Flex>
    );
  }

  return (
    <Flex direction="column" className="gap-6">
      <Typography>
        Your GitHub App has been created. Please set the following secrets as
        environment variables for the API:
      </Typography>
      <Flex className="gap-2">
        <Name>GITHUB_APP_SLUG</Name>
        <Secret>{secrets.slug}</Secret>
      </Flex>
      <Flex className="gap-2">
        <Name>GITHUB_APP_CLIENT_ID</Name>
        <Secret>{secrets.client_id}</Secret>
      </Flex>
      <Flex className="gap-2">
        <Name>GITHUB_APP_CLIENT_SECRET</Name>
        <Secret>{secrets.client_secret}</Secret>
      </Flex>
      <Flex className="gap-2">
        <Name>GITHUB_APP_PEM</Name>
        <Secret>{secrets.pem}</Secret>
      </Flex>
      <Flex className="gap-2">
        <Name>GITHUB_APP_WEBHOOK_SECRET</Name>
        <Secret>{secrets.webhook_secret}</Secret>
      </Flex>
      <hr />
      <Typography variant="xsmall">
        If you are planning to change{' '}
        <code className="rounded bg-neutral-300 px-1 pt-0.5">WEBHOOK_URI</code>{' '}
        environment variable for the API service, or if you are running the API
        service locally and have yet to configure it, you will need to update
        the webhook URL in your{' '}
        <Anchor href={`https://github.com/settings/apps/${secrets.slug}`} blank>
          <span className="underline">GitHub App</span>
        </Anchor>{' '}
        settings.
      </Typography>
    </Flex>
  );
};

export default AdminSetupGithub;
