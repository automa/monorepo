import React from 'react';

import { Flex, Typography } from 'components';

import { listBots } from './utils';

import BotCard from './BotCard';

import { Container, List } from './page.styles';

const BotsPage: React.FC = async () => {
  const bots = await listBots();

  return (
    <Container>
      <Flex direction="column" alignItems="center" className="gap-4">
        <Typography
          variant="title2"
          align="center"
          className="text-3xl md:text-4xl"
        >
          Explore Bots
        </Typography>
        <Typography
          variant="title6"
          align="center"
          className="text-neutral-500"
        >
          Discover a variety of bots to work alongside you
        </Typography>
      </Flex>

      <List>
        {bots.map((bot) => (
          <BotCard key={bot.id} bot={bot} />
        ))}
      </List>
    </Container>
  );
};

export default BotsPage;
