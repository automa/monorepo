import { gql } from 'gql';

export const TASK_CREATE_MUTATION = gql(`
  mutation TaskCreate($org_id: Int!, $input: TaskMessageInput!) {
    taskCreate(org_id: $org_id, input: $input) {
      ...Task
    }
  }
`);
