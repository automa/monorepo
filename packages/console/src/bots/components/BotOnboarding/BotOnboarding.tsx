import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';

import { Flex, Typography } from 'shared';

import { BotOnboardingProps } from './types';

import { Card, Container } from './BotOnboarding.styles';

const DEFAULT_BOTS = [
  {
    botOrgName: 'automa',
    botName: 'aider',
    logo: 'https://aider.chat/assets/icons/apple-touch-icon.png',
  },
  {
    botOrgName: 'automa',
    botName: 'posthog',
    logo: 'https://posthog.com/brand/posthog-logomark.svg',
  },
];

const BotOnboarding: React.FC<BotOnboardingProps> = ({ ...props }) => {
  return (
    <Container {...props}>
      <Flex direction="column" alignItems="center" className="gap-2 lg:gap-4">
        <Typography variant="title4" align="center">
          Install bots
        </Typography>
        <Typography variant="small" align="center" className="text-neutral-600">
          We need to know the bots that you want to run on your code.
        </Typography>
      </Flex>
      <Flex className="gap-2 lg:gap-4">
        {DEFAULT_BOTS.map(({ botOrgName, botName, logo }, index) => (
          <Card key={index} to={`bots/${botOrgName}/${botName}`}>
            <Flex
              direction="column"
              alignItems="center"
              className="w-32 gap-2 lg:gap-4"
            >
              <img src={logo} alt={`${botName} logo`} className="size-16" />
              <Typography variant="small">
                {botOrgName} / {botName}
              </Typography>
            </Flex>
          </Card>
        ))}
      </Flex>
      <Link to="bots/new">
        <Flex alignItems="center" className="relative left-2 gap-1">
          <Typography align="center" link>
            Or explore bots to install
          </Typography>
          <ArrowUpRight className="size-4" />
        </Flex>
      </Link>
    </Container>
  );
};

export default BotOnboarding;
