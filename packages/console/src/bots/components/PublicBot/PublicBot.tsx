import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from '@phosphor-icons/react';

import { getFragment } from 'gql';
import { Flex, Tooltip } from 'shared';

import BotBase, { BOT_BASE_FRAGMENT } from '../BotBase';

import { PublicBotProps } from './types';

import { PUBLIC_BOT_FRAGMENT } from './PublicBot.queries';
import { Container } from './PublicBot.styles';

const PublicBot: React.FC<PublicBotProps> = ({ publicBot: data, ...props }) => {
  const publicBot = getFragment(PUBLIC_BOT_FRAGMENT, data);
  const botBase = getFragment(BOT_BASE_FRAGMENT, publicBot);

  return (
    <Link to={`../bots/new/${publicBot.org.name}/${botBase.name}`}>
      <Container {...props}>
        <Flex justifyContent="space-between" alignItems="center">
          <BotBase bot={publicBot} namePrefix={`${publicBot.org.name} / `} />
          {publicBot.installation && (
            <Tooltip body="Bot installed on this org">
              <Check className="size-5 text-green-500" />
            </Tooltip>
          )}
        </Flex>
      </Container>
    </Link>
  );
};

export default PublicBot;
