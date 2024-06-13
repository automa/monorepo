import { HTMLAttributes } from 'react';

import { Org } from 'orgs';

export interface BotOnboardingProps extends HTMLAttributes<HTMLDivElement> {
  org: Org;
}
