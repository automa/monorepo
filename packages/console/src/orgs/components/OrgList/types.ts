import { HTMLAttributes } from 'react';
import { ApolloQueryResult } from '@apollo/client';

import { FragmentType } from 'gql';
import { DashboardQuery } from 'gql/graphql';

import { ORGS_QUERY_FRAGMENT } from './OrgList.queries';

export interface OrgListProps extends HTMLAttributes<HTMLDivElement> {
  data: FragmentType<typeof ORGS_QUERY_FRAGMENT>;
  refetch?: () => Promise<ApolloQueryResult<DashboardQuery>>;
}
