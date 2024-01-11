import { gql } from 'gql';

export const REPOS_QUERY = gql(`
  query Repos($provider_type: ProviderType!, $name: String!) {
    org(provider_type: $provider_type, name: $name) {
      repos {
        id
        name
        is_private
        is_archived
        has_installation
      }
    }
  }
`);
