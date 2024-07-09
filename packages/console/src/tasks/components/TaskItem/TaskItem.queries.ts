import { gql } from 'gql';

export const TASK_ITEM_FRAGMENT = gql(`
  fragment TaskItemFragment on TaskItem {
    id
    type
    data
    created_at
    actor_user {
      ...UserAvatarFragment
    }
  }
`);
