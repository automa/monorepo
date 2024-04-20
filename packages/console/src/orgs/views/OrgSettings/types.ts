import { HTMLAttributes } from 'react';

import { Org } from 'orgs';

export interface OrgSettingsProps extends HTMLAttributes<HTMLDivElement> {
  org: Org;
}
