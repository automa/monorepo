import { Alarm, BellRinging } from '@phosphor-icons/react';

import { BotType } from 'gql/graphql';

export const botTypeDefinition = {
  [BotType.Manual]: {
    Icon: BellRinging,
    description: 'Bot triggered by users',
  },
  [BotType.Scheduled]: {
    Icon: Alarm,
    description: 'Bot triggered by a schedule',
  },
};
