import { gql } from 'gql';

export const ORGS_QUERY_FRAGMENT = gql(`
  fragment OrgsQueryFragment on Query {
    orgs {
      id
      name
      provider_type
      has_installation
    }
  }
`);
