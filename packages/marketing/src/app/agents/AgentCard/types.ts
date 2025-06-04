import { HTMLAttributes } from 'react';

import { Bot } from '../utils';

export interface AgentCardProps extends HTMLAttributes<HTMLDivElement> {
  bot: Bot;
}
