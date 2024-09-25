import React, { useMemo } from 'react';

import { IntegrationType } from '@automa/common';

import { Button, Flex, Tooltip, Typography } from 'shared';

import { integrations } from '../../consts';

import { IntegrationConnectCardProps } from './types';

import { Container, Tag } from './IntegrationConnectCard.styles';

const IntegrationConnectCard: React.FC<IntegrationConnectCardProps> = ({
  integration,
  connected,
  config,
  org,
  ...props
}) => {
  const {
    logo: Logo,
    name,
    description,
    info,
    disabled,
  } = integrations[integration];

  const connectIntegration = useMemo(
    () =>
      `${import.meta.env.VITE_API_URI}/api/orgs/${
        org.name
      }/integrations/connect/${integration}`,
    [org, integration],
  );

  const integrationInfo = useMemo(() => {
    const infoConfig = integration === IntegrationType.Github ? org : config;

    if (!infoConfig) {
      return '';
    }

    return ` to ${info(infoConfig)}`;
  }, [config, info, org, integration]);

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
          <Tag>Connected{integrationInfo}</Tag>
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
