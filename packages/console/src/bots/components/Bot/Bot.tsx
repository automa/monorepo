import React from 'react';

import { getFragment } from 'gql';
import { Flex, Typography } from 'shared';

import { BotProps } from './types';

import { BOT_FRAGMENT } from './Bot.queries';
import { Container, Description } from './Bot.styles';

const Bot: React.FC<BotProps> = ({ bot: data, ...props }) => {
  const bot = getFragment(BOT_FRAGMENT, data);

  return (
    <Container {...props}>
      <Flex direction="column" className="gap-2">
        <Typography variant="large">{bot.name}</Typography>
        <Description>{bot.short_description}</Description>
      </Flex>
    </Container>
  );
};

export default Bot;
