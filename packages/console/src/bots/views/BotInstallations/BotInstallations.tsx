import React from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { Button, Flex, Loader, Typography } from 'shared';
import { BotInstallation } from 'bots';
import { orgUri } from 'utils';

import { BotInstallationsProps } from './types';

import { BOT_INSTALLATIONS_QUERY } from './BotInstallations.queries';

const BotInstallations: React.FC<BotInstallationsProps> = ({ org }) => {
  // TODO: Add infinite scroll (with pagination cache)
  const { data, loading } = useQuery(BOT_INSTALLATIONS_QUERY, {
    variables: {
      org_id: org.id,
    },
  });

  if (!loading && !data?.botInstallations?.length) {
    return <Navigate to={orgUri(org, '/bots/new?onboarding=true')} replace />;
  }

  return (
    <Flex direction="column" className="gap-8">
      <Flex justifyContent="space-between" alignItems="center" className="h-9">
        <Typography variant="title6">Installed bots</Typography>
        <Button to={orgUri(org, '/bots/new')}>Install Bot</Button>
      </Flex>
      {loading && !data ? (
        <Flex justifyContent="center">
          <Loader />
        </Flex>
      ) : (
        <Flex direction="column" className="gap-2">
          {data!.botInstallations.map((botInstallation) => (
            <BotInstallation
              key={botInstallation.id}
              botInstallation={botInstallation}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default BotInstallations;
