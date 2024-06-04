import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { Flex, Loader } from 'shared';

import { PublicBot } from 'bots';

import { PublicBotsProps } from './types';

import { PUBLIC_BOTS_QUERY } from './PublicBots.queries';
import { Banner } from './PublicBots.styles';

const PublicBots: React.FC<PublicBotsProps> = ({ org }) => {
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

export default PublicBots;
