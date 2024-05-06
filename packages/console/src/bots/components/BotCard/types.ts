import { HTMLAttributes } from 'react';

import { FragmentType } from 'gql';

import { BOT_FRAGMENT } from './BotCard.queries';

export interface BotCardProps extends HTMLAttributes<HTMLDivElement> {
  bot: FragmentType<typeof BOT_FRAGMENT>;
}
