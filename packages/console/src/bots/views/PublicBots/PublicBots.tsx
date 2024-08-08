import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { Button, Flex, Loader, ToggleGroup, useFilters } from 'shared';

import { PublicBot, publicBotsfilters } from 'bots';

import { PublicBotsProps } from './types';

import { PUBLIC_BOTS_QUERY } from './PublicBots.queries';
import { Banner } from './PublicBots.styles';

const PublicBots: React.FC<PublicBotsProps> = ({ org }) => {
  const [searchParams] = useSearchParams();

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
    <>
      {searchParams.get('onboarding') && (
        <Banner>
          You have no bots installed. Please select one below to install.
        </Banner>
      )}
      <Flex direction="column" className="gap-8">
        <Flex
          justifyContent="flex-end"
          alignItems="center"
          className="h-9 gap-6"
        >
          <Flex className="gap-4">
            <ToggleGroup
              optional
              defaultValue={filterValues.type}
              options={filterOptions.type}
              onValueChange={filterChangeFns.type}
            />
            <ToggleGroup
              optional
              defaultValue={filterValues.ai}
              options={filterOptions.ai}
              onValueChange={filterChangeFns.ai}
            />
          </Flex>
          <Button to="../settings/bots/new">Create Bot</Button>
        </Flex>
        {loading && !data ? (
          <Flex justifyContent="center">
            <Loader />
          </Flex>
        ) : !data?.publicBots?.length ? (
          <Flex justifyContent="center">No bots</Flex>
        ) : (
          <Flex className="grid grid-cols-2 gap-4 md:gap-6">
            {data.publicBots.map((bot) => (
              <PublicBot key={bot.id} publicBot={bot} />
            ))}
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default PublicBots;
