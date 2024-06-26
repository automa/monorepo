import { gql } from 'gql';

export const ME_QUERY_FRAGMENT = gql(`
  fragment MeQueryFragment on Query {
    me {
      email
      ...UserAvatarFragment
    }
  }
`);

export const ME_QUERY = gql(`
  query Me {
    ...MeQueryFragment
  }
`);
