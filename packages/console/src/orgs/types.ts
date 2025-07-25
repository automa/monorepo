import { ProviderType } from 'gql/graphql';

export type Org = {
  id: number;
  name: string;
  provider_type: ProviderType;
  provider_id: string;
  provider_name: string;
  has_installation: boolean;
  github_installation_id?: number | null;

  bot_installations_count: number;
};
