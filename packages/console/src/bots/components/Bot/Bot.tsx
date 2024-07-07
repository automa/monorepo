import React from 'react';

import { getFragment } from 'gql';

import BotBase from '../BotBase';

import { BotProps } from './types';

import { BOT_FRAGMENT } from './Bot.queries';
import { Container } from './Bot.styles';

const Bot: React.FC<BotProps> = ({ bot: data, ...props }) => {
  const bot = getFragment(BOT_FRAGMENT, data);

  return (
    <Container {...props}>
      <BotBase bot={bot} />
    </Container>
  );
};

export default Bot;
