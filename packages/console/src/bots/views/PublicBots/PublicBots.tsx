import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { useAnalyticsPage } from 'analytics';
import { Button, Flex, Loader } from 'shared';
import ToggleGroup from 'shared/components/ToggleGroup';
import useFilters from 'shared/hooks/useFilters';

import { PublicBot, publicBotsfilters } from 'bots';
import { Org } from 'orgs';

import { PUBLIC_BOTS_QUERY } from './PublicBots.queries';

const PublicBots: React.FC = () => {
  const { org } = useOutletContext<{ org: Org }>();

  useAnalyticsPage('Bots', 'Public Bots Overview');

  const { filterValues, filterParams, filterOptions, filterChangeFns } =
    useFilters(publicBotsfilters);

  // TODO: Add infinite scroll (with pagination cache)
  const { data, loading } = useQuery(PUBLIC_BOTS_QUERY, {
    variables: {
      org_id: org.id,
      filter: filterParams,
    },
  });

  return (
    <Flex direction="column" className="gap-8">
      <Flex justifyContent="flex-end" alignItems="center" className="h-9 gap-6">
        <Flex className="gap-4">
          <ToggleGroup
            optional
            defaultValue={filterValues.scheduled}
            options={filterOptions.scheduled}
            onValueChange={filterChangeFns.scheduled}
          />
          <ToggleGroup
            optional
            defaultValue={filterValues.ai}
            options={filterOptions.ai}
            onValueChange={filterChangeFns.ai}
          />
        </Flex>
        <Button to="../../settings/bots/new">Create Bot</Button>
      </Flex>
      {loading && !data ? (
        <Loader />
      ) : !data?.publicBots.length ? (
        <Flex justifyContent="center">No bots</Flex>
      ) : (
        <Flex className="grid grid-cols-2 gap-4 md:gap-6">
          {data.publicBots.map((bot) => (
            <PublicBot key={bot.id} publicBot={bot} />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default PublicBots;
