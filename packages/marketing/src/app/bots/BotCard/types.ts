import { HTMLAttributes } from 'react';

import { Bot } from '../utils';

export interface BotCardProps extends HTMLAttributes<HTMLDivElement> {
  bot: Bot;
}
