import { gql } from 'gql';

export const ME_QUERY_FRAGMENT = gql(`
  fragment MeQueryFragment on Query {
    me {
      id
      name
      email
    }
  }
`);
