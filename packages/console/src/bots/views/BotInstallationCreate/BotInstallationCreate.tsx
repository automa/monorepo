import React from 'react';
import { useQuery } from '@apollo/client';

import { Flex, Loader } from 'shared';
import { PublicBot } from 'bots';

import { BotInstallationCreateProps } from './types';

import { PUBLIC_BOTS_QUERY } from './BotInstallationCreate.queries';

const BotInstallationCreate: React.FC<BotInstallationCreateProps> = () => {
  // TODO: Add infinite scroll (with pagination cache)
  const { data, loading } = useQuery(PUBLIC_BOTS_QUERY);

  return (
    <>
      {loading && !data ? (
        <Flex justifyContent="center">
          <Loader />
        </Flex>
      ) : !data?.publicBots?.length ? (
        <Flex justifyContent="center">No bots</Flex>
      ) : (
        <Flex className="grid grid-cols-auto gap-4 md:gap-6">
          {data.publicBots.map((bot) => (
            <PublicBot key={bot.id} publicBot={bot} />
          ))}
        </Flex>
      )}
    </>
  );
};

export default BotInstallationCreate;
