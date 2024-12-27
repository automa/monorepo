import { gql } from 'gql';

export const TASK_CREATE_MUTATION = gql(`
  mutation TaskCreate($org_id: Int!, $input: TaskCreateInput!) {
    taskCreate(org_id: $org_id, input: $input) {
      ...Task
    }
  }
`);

export const BOT_INSTALLATIONS_AS_OPTIONS_QUERY = gql(`
  query BotInstallationsAsOptions($org_id: Int!) {
    botInstallations(org_id: $org_id, filter: { type: manual }) {
      id
      bot {
        id
        name
        image_url
        org {
          id
          name
        }
      }
    }
  }
`);

export const REPOSITORIES_AS_OPTIONS_QUERY = gql(`
  query RepositoriesAsOptions($org_id: Int!) {
    repos(org_id: $org_id) {
      id
      name
    }
  }
`);
