import React, { useMemo } from 'react';

import { IntegrationType } from '@automa/common';

import { Button, Flex, Typography, Tooltip } from 'shared';
import { appName } from 'utils';

import { integrations } from '../../consts';

import { IntegrationConnectCardProps } from './types';

import { Container, Tag } from './IntegrationConnectCard.styles';

const IntegrationConnectCard: React.FC<IntegrationConnectCardProps> = ({
  integration,
  connected,
  org,
  ...props
}) => {
  const { logo: Logo, name, description, disabled } = integrations[integration];

  const connectGithub = useMemo(
    () =>
      `https://github.com/apps/${appName()}/installations/new/permissions?target_id=${
        org.provider_id
      }`,
    [org],
  );

  const connectIntegration = useMemo(
    () =>
      `${import.meta.env.VITE_API_URI}/api/orgs/${
        org.name
      }/integrations/${integration}`,
    [org, integration],
  );

  return (
    <Container {...props}>
      <Flex justifyContent="space-between" {...props}>
        <Flex alignItems="center" className="gap-4">
          <Logo className="size-8" />
          <Typography variant="title5">{name}</Typography>
        </Flex>
        {disabled ? (
          <Tooltip body="Coming soon!">
            <Button disabled size="small">
              Connect
            </Button>
          </Tooltip>
        ) : connected ? (
          <Tag>Connected</Tag>
        ) : (
          <Button size="small">
            <a
              href={
                integration === IntegrationType.Github
                  ? connectGithub
                  : connectIntegration
              }
            >
              Connect
            </a>
          </Button>
        )}
      </Flex>
      <Typography variant="small">{description}</Typography>
    </Container>
  );
};

export default IntegrationConnectCard;
