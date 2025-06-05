import React from 'react';

import { Flex, Typography } from 'components';

import { listAgents } from './utils';

import AgentCard from './AgentCard';

import { Container, List } from './page.styles';

const AgentsPage: React.FC = async () => {
  const bots = await listAgents();

  return (
    <Container>
      <Flex direction="column" alignItems="center" className="gap-4">
        <Typography
          variant="title2"
          align="center"
          className="text-3xl md:text-4xl"
        >
          Explore Agents
        </Typography>
        <Typography
          variant="title6"
          align="center"
          className="text-neutral-500"
        >
          Discover a variety of agents to work alongside you
        </Typography>
      </Flex>

      <List>
        {bots.map((bot) => (
          <AgentCard key={bot.id} bot={bot} />
        ))}
      </List>
    </Container>
  );
};

export default AgentsPage;
