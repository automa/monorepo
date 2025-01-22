import { gql } from 'gql';

export const USER_QUERY_FRAGMENT = gql(`
  fragment UserQuery on Query {
    user {
      email
      ...UserAvatar
    }
  }
`);

export const USER_QUERY = gql(`
  query User {
    ...UserQuery
  }
`);
