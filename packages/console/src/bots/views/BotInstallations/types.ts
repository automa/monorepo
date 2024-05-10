import { HTMLAttributes } from 'react';

import { Org } from 'orgs';

export interface BotInstallationsProps extends HTMLAttributes<HTMLDivElement> {
  org: Org;
}
