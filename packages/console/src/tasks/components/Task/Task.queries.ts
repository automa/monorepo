import { gql } from 'gql';

export const TASK_FRAGMENT = gql(`
  fragment TaskFragment on Task {
    id
    title
    created_at
    completed_at
    is_completed
    author {
      ...UserAvatarFragment
    }
    items {
      id
      type
      created_at
      content
      origin
      pull_request
    }
  }
`);
