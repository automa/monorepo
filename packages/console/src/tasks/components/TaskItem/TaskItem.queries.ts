import { gql } from 'gql';

export const TASK_ITEM_FRAGMENT = gql(`
  fragment TaskItem on TaskItem {
    id
    type
    data
    created_at
    actor_user {
      ...UserAvatar
    }
  }
`);
