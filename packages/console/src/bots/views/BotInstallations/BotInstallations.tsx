import React from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { useAnalyticsPage } from 'analytics';
import { Button, Flex, Loader, Typography } from 'shared';

import { BotInstallation } from 'bots';
import { Org } from 'orgs';

import { BOT_INSTALLATIONS_QUERY } from './BotInstallations.queries';

const BotInstallations: React.FC = () => {
  const { org } = useOutletContext<{ org: Org }>();

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
    return <Navigate to="new" replace />;
  }

  return (
    <Flex direction="column" className="gap-8">
      <Flex justifyContent="space-between" alignItems="center" className="h-9">
        <Typography variant="title6">Installed bots</Typography>
        <Button to="new">Install Bot</Button>
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
