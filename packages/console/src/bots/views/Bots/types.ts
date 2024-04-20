import { HTMLAttributes } from 'react';

import { Org } from 'orgs/types';

export interface BotsProps extends HTMLAttributes<HTMLDivElement> {
  org: Org;
}
