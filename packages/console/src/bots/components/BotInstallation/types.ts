import { HTMLAttributes } from 'react';

import { FragmentType } from 'gql';

import { BOT_INSTALLATION_FRAGMENT } from './BotInstallation.queries';

export interface BotInstallationProps extends HTMLAttributes<HTMLDivElement> {
  botInstallation: FragmentType<typeof BOT_INSTALLATION_FRAGMENT>;
}
