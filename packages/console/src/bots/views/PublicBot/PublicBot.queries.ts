import { gql } from 'gql';

export const PUBLIC_BOT_QUERY = gql(`
  query PublicBot(
    $org_name: String!
    $name: String!
    $org_id: Int!
  ) {
    publicBot(org_name: $org_name, name: $name) {
      id
      name
      short_description
      image_url
      type
      paths
      description
      homepage
      is_published
      is_preview
      is_deterministic
      org {
        name
      }
      installation(org_id: $org_id) {
        id
      }
    }
  }
`);

export const BOT_INSTALL_MUTATION = gql(`
  mutation BotInstall($org_id: Int!, $input: BotInstallInput!) {
    botInstall(org_id: $org_id, input: $input) {
      ...BotInstallation
    }
  }
`);

export const BOT_UNINSTALL_MUTATION = gql(`
  mutation BotUninstall($org_id: Int!, $bot_id: Int!) {
    botUninstall(org_id: $org_id, bot_id: $bot_id)
  }
`);
