import { HTMLAttributes } from 'react';

import { FragmentType } from 'gql';

import { BOT_BASE_FRAGMENT } from 'bots';

export interface BotProps extends HTMLAttributes<HTMLDivElement> {
  bot: FragmentType<typeof BOT_BASE_FRAGMENT>;
}
