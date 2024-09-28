import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';

import { ProviderType } from 'gql/graphql';
import { Flex, Tooltip, Typography } from 'shared';

import GithubLogo from 'assets/logos/github.svg?react';

import { RepoOnboardingProps } from './types';

import { Card, Container } from './RepoOnboarding.styles';

const RepoOnboarding: React.FC<RepoOnboardingProps> = ({ org, ...props }) => {
  const connectIntegration = useCallback(
    (integration: string) =>
      `${import.meta.env.VITE_API_URI}/api/orgs/${
        org.name
      }/integrations/${integration}`,
    [org],
  );

  return (
    <Container {...props}>
      <Flex direction="column" alignItems="center" className="gap-2 lg:gap-4">
        <Typography variant="title4" align="center">
          Give access to repositories
        </Typography>
        <Typography variant="small" align="center" className="text-neutral-600">
          We need to be able to access your repositories to read code and
          propose changes.{' '}
          {org.provider_type
            ? 'Please connect your provider by clicking the button below.'
            : 'Please choose a provider to connect to by clicking one of the buttons below.'}
        </Typography>
      </Flex>
      <Tooltip
        body="Install Automa app on GitHub"
        side="bottom"
        sideOffset={12}
      >
        <Card href={connectIntegration(ProviderType.Github)} blank>
          <Flex direction="column" alignItems="center" className="gap-6">
            <GithubLogo className="size-16" />
            <Typography variant="large">GitHub</Typography>
          </Flex>
        </Card>
      </Tooltip>
      <Link to="bots/new">
        <Flex alignItems="center" className="relative left-2 gap-1">
          <Typography align="center">Or explore bots to install</Typography>
          <ArrowUpRight className="size-4" />
        </Flex>
      </Link>
    </Container>
  );
};

export default RepoOnboarding;
