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
    bot {
      id
      name
      short_description
      image_url
      org {
        id
        name
      }
    }
    repo {
      id
      name
      org {
        id
        provider_type
        provider_name
      }
    }
    activity {
      id
      type
      from_state
      to_state
    }
  }
`);
