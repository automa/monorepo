import { ProviderType } from '@automa/common';

export type Org = {
  id: number;
  name: string;
  provider_type: ProviderType;
  provider_id: string;
  has_installation: boolean;
};
