import { gql } from 'gql';

export const INTEGRATION_SETUP_GITHUB_QUERY = gql(`
  query IntegrationSetupGithub {
    orgs {
      name
      github_installation_id
    }
  }
`);
