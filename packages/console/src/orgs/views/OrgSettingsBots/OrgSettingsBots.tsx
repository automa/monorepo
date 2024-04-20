import React from 'react';
import { useQuery } from '@apollo/client';

import { Flex, Typography } from 'shared';
import { Bot } from 'bots';

import { OrgSettingsBotsProps } from './types';

import { BOTS_QUERY } from './OrgSettingsBots.queries';

const OrgSettingsBots: React.FC<OrgSettingsBotsProps> = ({ org }) => {
  const { data, loading } = useQuery(BOTS_QUERY, {
    variables: {
      provider_type: org.provider_type,
      name: org.name,
    },
  });

  return (
    <>
      <Typography variant="title6">Automa Bots</Typography>
      {loading && !data ? (
        <div>Loading</div>
      ) : (
        <Flex direction="column" className="gap-8">
          {!data?.org?.bots?.length ? (
            <Flex justifyContent="center">No bots</Flex>
          ) : (
            <Flex className="grid grid-cols-auto gap-4 md:gap-6">
              {data.org.bots.map((bot) => (
                <Bot key={bot.id} bot={bot} />
              ))}
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
};

export default OrgSettingsBots;
