import { gql } from 'gql';

export const ME_QUERY_FRAGMENT = gql(`
  fragment MeQuery on Query {
    me {
      email
      ...UserAvatar
    }
  }
`);

export const ME_QUERY = gql(`
  query Me {
    ...MeQuery
  }
`);
