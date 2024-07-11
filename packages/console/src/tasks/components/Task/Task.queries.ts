import { gql } from 'gql';

export const TASK_FRAGMENT = gql(`
  fragment Task on Task {
    id
    title
    created_at
    completed_at
    is_completed
    items {
      ...TaskItem
    }
  }
`);
