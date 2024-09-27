import { HTMLAttributes } from 'react';

import { IntegrationType } from 'gql/graphql';

import { Org } from 'orgs';

export interface IntegrationConnectCardProps
  extends HTMLAttributes<HTMLDivElement> {
  integration: IntegrationType;
  connected: boolean;
  config: any;
  org: Org;
}
