import { HTMLAttributes } from 'react';

import { Org } from 'orgs/types';

export interface OrgSettingsBotsProps extends HTMLAttributes<HTMLDivElement> {
  org: Org;
}
