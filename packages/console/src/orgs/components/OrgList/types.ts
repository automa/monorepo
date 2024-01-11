import { HTMLAttributes } from 'react';

import { FragmentType } from 'gql';

import { ORGS_QUERY_FRAGMENT } from './OrgList.queries';

export interface OrgListProps extends HTMLAttributes<HTMLDivElement> {
  data: FragmentType<typeof ORGS_QUERY_FRAGMENT>;
}
