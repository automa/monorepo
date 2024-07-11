import { gql } from 'gql';

export const DASHBOARD_QUERY = gql(`
  query Dashboard {
    ...MeQuery
    ...OrgsQuery
  }
`);
