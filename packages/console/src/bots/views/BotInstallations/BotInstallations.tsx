import React from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { useAnalyticsPage } from 'analytics';
import { Button, Flex, Loader, Typography } from 'shared';

import BotInstallation from 'bots/components/BotInstallation';

import { BotInstallationsProps } from './types';

import { BOT_INSTALLATIONS_QUERY } from './BotInstallations.queries';

const BotInstallations: React.FC<BotInstallationsProps> = ({ org }) => {
  useAnalyticsPage('Bots', 'Bot Installations Overview');

  // TODO: Add infinite scroll (with pagination cache)
  const { data, loading } = useQuery(BOT_INSTALLATIONS_QUERY, {
    variables: {
      org_id: org.id,
    },
    skip: !org.bot_installations_count,
  });

  if (
    !org.bot_installations_count ||
    (!loading && !data?.botInstallations.length)
  ) {
    return <Navigate to="../bots/new" replace />;
  }

  return (
    <Flex direction="column" className="gap-8">
      <Flex justifyContent="space-between" alignItems="center" className="h-9">
        <Typography variant="title6">Installed bots</Typography>
        <Button to="../bots/new">Install Bot</Button>
      </Flex>
      {loading && !data ? (
        <Loader />
      ) : (
        <Flex direction="column" className="gap-4">
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
