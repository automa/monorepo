import { gql } from 'gql';

export const REPO_QUERY = gql(`
  query Repo(
    $org_name: String!
    $name: String!
  ) {
    repo(org_name: $org_name, name: $name) {
      id
      name
      provider_id
      is_private
      is_archived
      has_installation
      org {
        id
        name
        provider_type
        github_installation_id
      }
    }
  }
`);
