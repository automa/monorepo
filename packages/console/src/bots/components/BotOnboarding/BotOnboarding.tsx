import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';

import { Flex, Typography } from 'shared';

import { BotOnboardingProps } from './types';

import { BotName, Card, Container, Content } from './BotOnboarding.styles';

// TODO: Add description as tooltip after loading these from DB
const DEFAULT_BOTS = [
  {
    botOrgName: 'automa',
    botName: 'package-badges',
    logo: 'https://avatars.githubusercontent.com/u/6254238?s=64',
  },
  {
    botOrgName: 'automa',
    botName: 'github-runners',
    logo: 'https://depot.dev/assets/brand/1693758816/depot-icon-on-light.svg',
  },
  {
    botOrgName: 'automa',
    botName: 'aider',
    logo: 'https://aider.chat/assets/icons/apple-touch-icon.png',
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
            <Content>
              <img src={logo} alt={`${botName} logo`} className="size-16" />
              <Flex direction="column" className="gap-1 lg:gap-2">
                <BotName>{botName}</BotName>
                <Typography variant="xsmall" className="text-neutral-600">
                  by {botOrgName}
                </Typography>
              </Flex>
            </Content>
          </Card>
        ))}
      </Flex>
      <Link to="bots/new">
        <Flex alignItems="center" className="relative left-2 gap-1">
          <Typography align="center">Or explore bots to install</Typography>
          <ArrowUpRight className="size-4" />
        </Flex>
      </Link>
    </Container>
  );
};

export default BotOnboarding;
