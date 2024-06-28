import { gql } from 'gql';

export const USER_AVATAR_FRAGMENT = gql(`
  fragment UserAvatarFragment on User {
    id
    name
    providers {
      id
      provider_type
      provider_id
    }
  }
`);
