import { HTMLAttributes } from 'react';

import { Bot } from '../utils';

export interface AgentBadgesProps extends HTMLAttributes<HTMLDivElement> {
  bot: Bot;
}
