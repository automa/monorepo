import { HTMLAttributes } from 'react';

import { FragmentType } from 'gql';

import { BOT_FRAGMENT } from './Bot.queries';

export interface BotProps extends HTMLAttributes<HTMLDivElement> {
  bot: FragmentType<typeof BOT_FRAGMENT>;
}
