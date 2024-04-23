import React from 'react';
import { useQuery } from '@apollo/client';

import { Button, Flex, Link, Typography } from 'shared';

import { Bot } from 'bots/components';

import { BotsProps } from './types';

import { BOTS_QUERY } from './Bots.queries';

const Bots: React.FC<BotsProps> = ({ org }) => {
  const { data, loading } = useQuery(BOTS_QUERY, {
    variables: {
      provider_type: org.provider_type,
      name: org.name,
    },
  });

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" className="h-9">
        <Typography variant="title6">Automa Bots</Typography>
        <Link to={`/${org.provider_type}/${org.name}/settings/bots/new`}>
          <Button>Create Bot</Button>
        </Link>
      </Flex>
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

export default Bots;
