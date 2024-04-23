import { HTMLAttributes } from 'react';

import { Org } from 'orgs';

export interface BotCreateProps extends HTMLAttributes<HTMLDivElement> {
  org: Org;
}
