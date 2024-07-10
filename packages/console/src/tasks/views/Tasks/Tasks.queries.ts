import { gql } from 'gql';

export const TASKS_QUERY = gql(`
  query Tasks($org_id: Int!) {
    tasks(org_id: $org_id) {
      id
      ...Task
    }
  }
`);
