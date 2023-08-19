import { gql } from '@apollo/client';

export const GET_ORG = gql`
  query GetOrg($provider_type: ProviderType!, $name: String!) {
    org(provider_type: $provider_type, name: $name) {
      id
      name
      github_installation_id
      repos {
        id
        name
        is_private
        is_archived
        has_installation
      }
    }
  }
`;

export const GET_ORGS = gql`
  query GetOrgs {
    orgs {
      id
      name
      has_installation
    }
  }
`;
