import React from 'react';
import { Robot } from '@phosphor-icons/react';

import { getFragment } from 'gql';
import { Badge, Flex, Typography } from 'shared';

import { BotProps } from './types';

import { BOT_FRAGMENT } from './Bot.queries';
import { Container, Description } from './Bot.styles';

const Bot: React.FC<BotProps> = ({ bot: data, ...props }) => {
  const bot = getFragment(BOT_FRAGMENT, data);

  return (
    <Container {...props}>
      <Flex alignItems="center" className="gap-4">
        {bot.image_url ? (
          <img src={bot.image_url} alt={bot.name} className="size-16" />
        ) : (
          <Robot className="size-16 text-neutral-400" />
        )}
        <Flex direction="column" className="gap-2">
          <Flex alignItems="center" className="gap-2">
            <Typography variant="large" className="break-all">
              {bot.name}
            </Typography>
            {!bot.is_published && <Badge variant="warning">Private</Badge>}
            {bot.is_preview && <Badge variant="success">Beta</Badge>}
            <Badge variant="tag">
              {bot.is_deterministic ? 'Deterministic' : 'Uses AI'}
            </Badge>
          </Flex>
          <Description>{bot.short_description}</Description>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Bot;
