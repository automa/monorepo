import { gql } from 'gql';

export const PUBLIC_BOT_QUERY = gql(`
  query PublicBot($id: Int!) {
    publicBot(id: $id) {
      id
      name
      short_description
      description
      homepage
      org {
        name
      }
    }
  }
`);

export const BOT_INSTALL_MUTATION = gql(`
  mutation BotInstall($org_id: Int!, $input: BotInstallInput!) {
    botInstall(org_id: $org_id, input: $input) {
      ...BotInstallationFragment
    }
  }
`);
