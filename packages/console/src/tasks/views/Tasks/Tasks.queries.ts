import { gql } from 'gql';

export const TASKS_QUERY = gql(`
  query Tasks($org_id: Int!, $filter: TasksFilter) {
    tasks(org_id: $org_id, filter: $filter) {
      id
      ...Task
    }
  }
`);
