import React from 'react';
import { Robot } from '@phosphor-icons/react';

import { getFragment } from 'gql';
import { Badge, Flex, Tooltip, Typography } from 'shared';

import { botTypeDefinition } from 'bots/utils';

import { BotBaseProps } from './types';

import { BOT_BASE_FRAGMENT } from './BotBase.queries';

const BotBase: React.FC<BotBaseProps> = ({
  bot: data,
  namePrefix,
  ...props
}) => {
  const bot = getFragment(BOT_BASE_FRAGMENT, data);

  const { description: botTypeDescription, Icon } =
    botTypeDefinition[bot.type] ?? {};

  return (
    <Flex {...props} alignItems="center" className="gap-4">
      {bot.image_url ? (
        <img src={bot.image_url} alt={bot.name} className="size-16" />
      ) : (
        <Robot className="size-16 text-neutral-400" />
      )}
      <Flex direction="column" className="gap-2">
        <Flex alignItems="center" className="gap-2">
          <Typography variant="large" className="break-all">
            {namePrefix ?? ''}
            {bot.name}
          </Typography>
          {botTypeDescription && (
            <Tooltip body={botTypeDescription}>
              <Icon className="mr-1 size-4" />
            </Tooltip>
          )}
          {!bot.is_published && <Badge variant="warning">Private</Badge>}
          {bot.is_preview && <Badge variant="success">Beta</Badge>}
          <Badge variant="info">
            {bot.is_deterministic ? 'Deterministic' : 'Uses AI'}
          </Badge>
        </Flex>
        <Typography variant="small" className="text-neutral-600">
          {bot.short_description}
        </Typography>
      </Flex>
    </Flex>
  );
};

export default BotBase;
