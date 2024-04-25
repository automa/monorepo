import React from 'react';
import { useQuery } from '@apollo/client';

import { Button, Flex, Link, Loader, Typography } from 'shared';
import { orgUri } from 'utils';

import { Bot } from 'bots/components';

import { BotsProps } from './types';

import { BOTS_QUERY } from './Bots.queries';

const Bots: React.FC<BotsProps> = ({ org }) => {
  // TODO: Add infinite scroll
  const { data, loading } = useQuery(BOTS_QUERY, {
    variables: {
      org_id: org.id,
    },
  });

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" className="h-9">
        <Typography variant="title6">Automa Bots</Typography>
        <Link to={orgUri(org, '/settings/bots/new')}>
          <Button>Create Bot</Button>
        </Link>
      </Flex>
      {loading && !data ? (
        <Flex justifyContent="center">
          <Loader />
        </Flex>
      ) : !data?.bots?.length ? (
        <Flex justifyContent="center">No bots</Flex>
      ) : (
        <Flex className="grid grid-cols-auto gap-4 md:gap-6">
          {data.bots.map((bot) => (
            <Bot key={bot.id} bot={bot} />
          ))}
        </Flex>
      )}
    </>
  );
};

export default Bots;
