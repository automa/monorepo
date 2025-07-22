import { HTMLAttributes } from 'react';

import { Bot } from '../utils';

export interface BotBadgesProps extends HTMLAttributes<HTMLDivElement> {
  bot: Bot;
}
