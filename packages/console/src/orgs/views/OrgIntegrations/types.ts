import { HTMLAttributes } from 'react';

import { OrgQuery } from 'gql/graphql';

export interface OrgIntegrationsProps extends HTMLAttributes<HTMLDivElement> {
  org: NonNullable<OrgQuery['org']>;
}
