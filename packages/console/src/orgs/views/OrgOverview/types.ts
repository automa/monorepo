import { HTMLAttributes } from 'react';

import { OrgQuery } from 'gql/graphql';

export interface OrgOverviewProps extends HTMLAttributes<HTMLDivElement> {
  org: NonNullable<OrgQuery['org']>;
}
