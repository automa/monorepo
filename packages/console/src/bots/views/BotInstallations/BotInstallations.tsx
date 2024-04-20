import React from 'react';
import { useQuery } from '@apollo/client';

import { Flex, Loader } from 'shared';
import { BotInstallation } from 'bots';

import { BotInstallationsProps } from './types';

import { BOT_INSTALLATIONS_QUERY } from './BotInstallations.queries';

const BotInstallations: React.FC<BotInstallationsProps> = ({ org }) => {
  // TODO: Add infinite scroll
  const { data, loading } = useQuery(BOT_INSTALLATIONS_QUERY, {
    variables: {
      org_id: org.id,
    },
  });

  return (
    <>
      {loading && !data ? (
        <Flex justifyContent="center">
          <Loader />
        </Flex>
      ) : !data?.botInstallations?.length ? (
        <Flex justifyContent="center">No bots installed</Flex>
      ) : (
        <Flex direction="column" className="gap-2">
          {data.botInstallations.map((botInstallation) => (
            <BotInstallation
              key={botInstallation.id}
              botInstallation={botInstallation}
            />
          ))}
        </Flex>
      )}
    </>
  );
};

export default BotInstallations;
