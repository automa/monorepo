import { gql } from 'gql';

export const BOT_INSTALLATION_FRAGMENT = gql(`
  fragment BotInstallationFragment on BotInstallation {
    id
    created_at
    bot {
      name
      org {
        provider_type
        name
      }
    }
  }
`);
