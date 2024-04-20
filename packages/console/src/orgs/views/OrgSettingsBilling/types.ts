import { HTMLAttributes } from 'react';

import { Org } from 'orgs/types';

export interface OrgSettingsBillingProps
  extends HTMLAttributes<HTMLDivElement> {
  org: Org;
}
