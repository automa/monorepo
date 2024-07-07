import React, { useMemo } from 'react';
import { Alarm, BellRinging, Robot } from '@phosphor-icons/react';

import { BotType } from '@automa/common';

import { getFragment } from 'gql';
import { Badge, Flex, Tooltip, Typography } from 'shared';

import { BotBaseProps } from './types';

import { BOT_BASE_FRAGMENT } from './BotBase.queries';

const BotBase: React.FC<BotBaseProps> = ({
  bot: data,
  namePrefix,
  ...props
}) => {
  const bot = getFragment(BOT_BASE_FRAGMENT, data);

  const { tooltipBody, Icon } = useMemo(
    () =>
      bot.type === BotType.Event
        ? {
            tooltipBody: 'Bot triggered by events or commands',
            Icon: BellRinging,
          }
        : bot.type === BotType.Scheduled
        ? {
            tooltipBody: 'Bot triggered by a schedule',
            Icon: Alarm,
          }
        : {},
    [bot.type],
  );

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
          {tooltipBody && (
            <Tooltip body={tooltipBody}>
              <Icon className="mr-1 size-4" />
            </Tooltip>
          )}
          {!bot.is_published && <Badge variant="warning">Private</Badge>}
          {bot.is_preview && <Badge variant="success">Beta</Badge>}
          <Badge variant="tag">
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
