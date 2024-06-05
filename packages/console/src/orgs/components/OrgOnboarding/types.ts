import { HTMLAttributes } from 'react';

import { Org } from 'orgs/types';

export interface OrgOnboardingProps extends HTMLAttributes<HTMLDivElement> {
  org: Org;
}
