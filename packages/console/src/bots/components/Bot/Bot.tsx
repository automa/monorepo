import React from 'react';
import { Link } from 'react-router-dom';

import { getFragment } from 'gql';

import BotBase, { BOT_BASE_FRAGMENT } from '../BotBase';

import { BotProps } from './types';

import { BOT_FRAGMENT } from './Bot.queries';
import { Container } from './Bot.styles';

const Bot: React.FC<BotProps> = ({ bot: data, ...props }) => {
  const bot = getFragment(BOT_FRAGMENT, data);
  const botBase = getFragment(BOT_BASE_FRAGMENT, bot);

  return (
    <Link to={botBase.name}>
      <Container {...props}>
        <BotBase bot={bot} />
      </Container>
    </Link>
  );
};

export default Bot;
