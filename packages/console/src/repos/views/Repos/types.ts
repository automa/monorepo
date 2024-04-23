import { HTMLAttributes } from 'react';

import { Org } from 'orgs';

export interface ReposProps extends HTMLAttributes<HTMLDivElement> {
  org: Org;
}
