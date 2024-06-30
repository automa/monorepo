import { gql } from 'gql';

export const TASK_QUERY = gql(`
  query Task($org_id: Int!, $id: Int!) {
    task(org_id: $org_id, id: $id) {
      id
      ...TaskFragment
    }
  }
`);
