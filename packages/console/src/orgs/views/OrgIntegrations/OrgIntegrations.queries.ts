import { gql } from 'gql';

export const INTEGRATION_CONNECTIONS_QUERY = gql(`
  query IntegrationConnections($org_id: Int!) {
    project_integration_connections(org_id: $org_id) {
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
`);
