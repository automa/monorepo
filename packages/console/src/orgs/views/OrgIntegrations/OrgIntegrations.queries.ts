import { gql } from 'gql';

export const INTEGRATIONS_QUERY = gql(`
  query Integrations($org_id: Int!) {
    integrations(org_id: $org_id) {
      id
      type
      config
      created_at
      author {
        name
      }
    }
  }
`);
