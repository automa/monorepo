import { HTMLAttributes } from 'react';

import { FragmentType } from 'gql';

import { PUBLIC_BOT_FRAGMENT } from './PublicBot.queries';

export interface PublicBotProps extends HTMLAttributes<HTMLDivElement> {
  publicBot: FragmentType<typeof PUBLIC_BOT_FRAGMENT>;
}
