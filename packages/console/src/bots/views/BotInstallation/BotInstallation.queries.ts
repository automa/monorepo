import { gql } from 'gql';

export const BOT_INSTALLATION_BOT_QUERY = gql(`
  query BotInstallationBot(
    $org_name: String!
    $name: String!
    $org_id: Int!
  ) {
    publicBot(org_name: $org_name, name: $name) {
      id
      short_description
      type
      image_url
      installation(org_id: $org_id) {
        id
      }
    }
  }
`);

export const BOT_INSTALLATION_TASKS_QUERY = gql(`
  query BotInstallationTasks(
    $org_id: Int!
    $bot_id: Int!
  ) {
    tasks(org_id: $org_id, filter: { bot_id: $bot_id }) {
      id
      ...Task
    }
  }
`);

export const BOT_UNINSTALL_MUTATION = gql(`
  mutation BotUninstall($org_id: Int!, $bot_id: Int!) {
    botUninstall(org_id: $org_id, bot_id: $bot_id)
  }
`);
