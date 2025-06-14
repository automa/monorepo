import { gql } from 'gql';

export const APP_QUERY = gql(`
  query App {
    app {
      cloud
      client_uri
      integrations {
        github
        gitlab
        linear
        jira
        slack
      }
    }
    user {
      id
      email
    }
  }
`);
