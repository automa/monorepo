import { gql } from 'gql';

export const ORG_QUERY = gql(`
  query Org($provider_type: ProviderType!, $name: String!) {
    org(provider_type: $provider_type, name: $name) {
      id
      name
      provider_type
    }
  }
`);
