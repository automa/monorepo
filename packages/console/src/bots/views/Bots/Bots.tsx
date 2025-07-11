import React from 'react';
import { useQuery } from '@apollo/client';

import { Button, Flex, Loader, Typography } from 'shared';

import { Bot } from 'bots';

import { BotsProps } from './types';

import { BOTS_QUERY } from './Bots.queries';

const Bots: React.FC<BotsProps> = ({ org }) => {
  // TODO: Add infinite scroll (with pagination cache)
  const { data, loading } = useQuery(BOTS_QUERY, {
    variables: {
      org_id: org.id,
    },
  });

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" className="h-9">
        <Typography variant="title6">Automa Bots</Typography>
        <Button to="../bots/new">Create Bot</Button>
      </Flex>
      {loading && !data ? (
        <Loader />
      ) : !data?.bots.length ? (
        <Flex justifyContent="center">No bots</Flex>
      ) : (
        <Flex className="grid grid-cols-2 gap-4 md:gap-6">
          {data.bots.map((bot) => (
            <Bot key={bot.id} bot={bot} />
          ))}
        </Flex>
      )}
    </>
  );
};

export default Bots;
