import { gql } from '@apollo/client';

export const GET_ORG = gql`
  query GetOrg($provider_type: ProviderType!, $name: String!) {
    org(provider_type: $provider_type, name: $name) {
      id
      name
      provider_type
      provider_id
      has_installation
    }
  }
`;

export const GET_ORGS = gql`
  query GetOrgs {
    orgs {
      id
      name
    }
  }
`;
