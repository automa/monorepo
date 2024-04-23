import { HTMLAttributes } from 'react';

import { Org } from 'orgs';

export interface OrgIntegrationsProps extends HTMLAttributes<HTMLDivElement> {
  org: Org;
}
