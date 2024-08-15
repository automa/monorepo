import { Alarm, BellRinging } from '@phosphor-icons/react';

import { BotType } from '@automa/common';

export const botTypeDefinition = {
  [BotType.Event]: {
    Icon: BellRinging,
    description: 'Bot triggered by events or commands',
  },
  [BotType.Scheduled]: {
    Icon: Alarm,
    description: 'Bot triggered by a schedule',
  },
};
