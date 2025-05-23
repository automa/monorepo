import { gql } from 'gql';

export const TASK_FRAGMENT = gql(`
  fragment Task on Task {
    id
    title
    is_scheduled
    state
    created_at
    items {
      type
      ...TaskItem
    }
  }
`);
