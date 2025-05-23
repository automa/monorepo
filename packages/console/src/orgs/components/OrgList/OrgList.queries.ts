import { gql } from 'gql';

export const ORGS_QUERY_FRAGMENT = gql(`
  fragment OrgsQuery on Query {
    orgs {
      id
      name
      provider_type
      provider_id
      provider_name
      has_installation
      github_installation_id

      bot_installations_count
    }
  }
`);
