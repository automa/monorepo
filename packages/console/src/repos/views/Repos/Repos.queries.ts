import { gql } from 'gql';

export const REPOS_QUERY = gql(`
  query Repos($org_id: Int!) {
    repos(org_id: $org_id) {
      id
      ...Repo
    }
  }
`);
