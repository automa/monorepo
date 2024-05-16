import { gql } from 'gql';

export const TASK_FRAGMENT = gql(`
  fragment TaskFragment on Task {
    id
    title
    created_at
    # TODO: User fragment for avatar component
    author {
      id
      name
      providers {
        id
        provider_type
        provider_id
      }
    }
  }
`);
