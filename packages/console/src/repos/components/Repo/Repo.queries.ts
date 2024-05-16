import { gql } from 'gql';

export const REPO_FRAGMENT = gql(`
  fragment RepoFragment on Repo {
    id
    name
    is_private
    is_archived
    has_installation
  }
`);
