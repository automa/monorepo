import { gql } from '@apollo/client';

export const GET_ORGS = gql`
  query GetOrgs {
    orgs {
      id
      name
    }
  }
`;
