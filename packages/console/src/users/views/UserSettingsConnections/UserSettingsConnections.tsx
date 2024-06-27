import React from 'react';
import { useQuery } from '@apollo/client';

import { getFragment } from 'gql';
import { Button, Flex, Tooltip, Typography } from 'shared';

import { ME_QUERY, ME_QUERY_FRAGMENT } from 'users';

import { UserSettingsConnectionsProps } from './types';
import { providers } from './utils';

import { Card, Tag } from './UserSettingsConnections.styles';

const UserSettingsConnections: React.FC<UserSettingsConnectionsProps> = () => {
  const { data: fullData } = useQuery(ME_QUERY);

  const data = getFragment(ME_QUERY_FRAGMENT, fullData);

  if (!data) return null;

  return (
    <>
      <Typography variant="title6">Connections</Typography>
      {Object.entries(providers).map(
        ([type, { name, logo: Logo, disabled }]) => {
          const connected = data.me.providers.find(
            ({ provider_type }) => provider_type === type,
          );

          return (
            <Card key={name} justifyContent="space-between">
              <Flex alignItems="center" className="gap-4">
                <Logo className="size-8" />
                <Typography variant="title6">{name}</Typography>
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
                <Button size="small">Connect</Button>
              )}
            </Card>
          );
        },
      )}
    </>
  );
};

export default UserSettingsConnections;
