import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { Flex, Loader } from 'shared';
import { PublicBot } from 'bots';

import { BotInstallationCreateProps } from './types';

import { PUBLIC_BOTS_QUERY } from './BotInstallationCreate.queries';
import { Banner } from './BotInstallationCreate.styles';

const BotInstallationCreate: React.FC<BotInstallationCreateProps> = ({
  org,
}) => {
  const [searchParams] = useSearchParams();

  // TODO: Add infinite scroll (with pagination cache)
  const { data, loading } = useQuery(PUBLIC_BOTS_QUERY, {
    variables: {
      org_id: org.id,
    },
  });

  return (
    <>
      {searchParams.get('onboarding') && (
        <Banner>
          You have no bots installed. Please select one below to install.
        </Banner>
      )}
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
