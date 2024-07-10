import { gql } from 'gql';

export const USER_AVATAR_FRAGMENT = gql(`
  fragment UserAvatar on User {
    id
    name
    providers {
      id
      provider_type
      provider_id
    }
  }
`);
