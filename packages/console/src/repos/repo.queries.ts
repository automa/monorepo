import { gql } from '@apollo/client';

export const GET_REPO = gql`
  query GetRepo(
    $provider_type: ProviderType!
    $org_name: String!
    $name: String!
  ) {
    repo(provider_type: $provider_type, org_name: $org_name, name: $name) {
      id
      name
      provider_id
      is_private
      is_archived
      has_installation
      org {
        id
        name
        github_installation_id
      }
    }
  }
`;
