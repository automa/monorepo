import React from 'react';

import { getFragment } from 'gql';

import { BotCardProps } from './types';

import { BOT_FRAGMENT } from './BotCard.queries';
import { Container } from './BotCard.styles';

const BotCard: React.FC<BotCardProps> = ({ bot: data, ...props }) => {
  const bot = getFragment(BOT_FRAGMENT, data);

  return (
    <Container {...props} asChild>
      <div>{bot.name}</div>
    </Container>
  );
};

export default BotCard;
