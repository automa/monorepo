import { HTMLAttributes } from 'react';

import { FragmentType } from 'gql';

import { BOT_BASE_FRAGMENT } from './BotBase.queries';

export interface BotBaseProps extends HTMLAttributes<HTMLDivElement> {
  bot: FragmentType<typeof BOT_BASE_FRAGMENT>;
  namePrefix?: string;
}
