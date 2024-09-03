import { HTMLAttributes } from 'react';

import { IntegrationType } from '@automa/common';

import { Org } from 'orgs';

export interface IntegrationConnectCardProps
  extends HTMLAttributes<HTMLDivElement> {
  integration: IntegrationType;
  connected: boolean;
  config: any;
  org: Org;
}
