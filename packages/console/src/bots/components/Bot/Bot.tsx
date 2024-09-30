import React from 'react';
import { Link } from 'react-router-dom';

import { getFragment } from 'gql';

import BotBase, { BOT_BASE_FRAGMENT } from '../BotBase';

import { BotProps } from './types';

import { Container } from './Bot.styles';

const Bot: React.FC<BotProps> = ({ bot: data, ...props }) => {
  const botBase = getFragment(BOT_BASE_FRAGMENT, data);

  return (
    <Link to={botBase.name}>
      <Container {...props}>
        <BotBase bot={data} />
      </Container>
    </Link>
  );
};

export default Bot;
