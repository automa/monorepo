import { HTMLAttributes } from 'react';

import { Org } from 'orgs';

export interface RepoOnboardingProps extends HTMLAttributes<HTMLDivElement> {
  org: Org;
}
