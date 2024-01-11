import { gql } from 'gql';

export const INTEGRATION_CONNECTIONS_QUERY = gql(`
  query IntegrationConnections($provider_type: ProviderType!, $name: String!) {
    org(provider_type: $provider_type, name: $name) {
      project_integration_connections {
        id
        name
        provider_type
        config
        created_at
        author {
          name
        }
      }
    }
  }
`);
