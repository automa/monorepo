import { gql } from 'gql';

export const REPO_QUERY = gql(`
  query Repo(
    $org_id: Int!
    $name: String!
  ) {
    repo(org_id: $org_id, name: $name) {
      id
      name
      is_private
      is_archived
      has_installation
    }
  }
`);

export const REPO_TASKS_QUERY = gql(`
  query RepoTasks(
    $org_id: Int!
    $repo_id: Int!
  ) {
    tasks(org_id: $org_id, filter: { repo_id: $repo_id }) {
      id
      ...Task
    }
  }
`);
