import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';

import { Flex, Tooltip, Typography } from 'shared';

import { BotOnboardingProps } from './types';

import { BotName, Card, Container, Content } from './BotOnboarding.styles';

const DEFAULT_BOTS = [
  {
    botOrgName: 'openai',
    botName: 'codex',
    logo: 'https://automa.app/logos/openai.svg',
    shortDescription: "OpenAI's coding agent",
  },
  {
    botOrgName: 'anthropic',
    botName: 'claude-code',
    logo: 'https://automa.app/logos/claude.svg',
    shortDescription: "Anthropic's coding agent",
  },
  {
    botOrgName: 'google',
    botName: 'gemini',
    logo: 'https://automa.app/logos/gemini.svg',
    shortDescription: "Google's coding agent",
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
        {DEFAULT_BOTS.map(
          ({ botOrgName, botName, logo, shortDescription }, index) => (
            <Tooltip key={index} body={shortDescription}>
              <Card key={index} to={`bots/new/${botOrgName}/${botName}`}>
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
            </Tooltip>
          ),
        )}
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
