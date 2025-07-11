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
      type
      paths
      image_url
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
