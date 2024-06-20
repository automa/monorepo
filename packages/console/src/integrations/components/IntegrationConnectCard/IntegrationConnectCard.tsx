import React, { useMemo } from 'react';

import { Button, Flex, Tooltip, Typography } from 'shared';

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
          <Button href={connectIntegration} size="small">
            Connect
          </Button>
        )}
      </Flex>
      <Typography variant="small">{description}</Typography>
    </Container>
  );
};

export default IntegrationConnectCard;
