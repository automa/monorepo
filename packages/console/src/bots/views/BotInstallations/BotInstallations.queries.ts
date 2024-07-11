import { gql } from 'gql';

export const BOT_INSTALLATIONS_QUERY = gql(`
  query BotInstallations($org_id: Int!) {
    botInstallations(org_id: $org_id) {
      id
      ...BotInstallation
    }
  }
`);
