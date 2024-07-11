import { gql } from 'gql';

export const BOT_INSTALLATION_FRAGMENT = gql(`
  fragment BotInstallation on BotInstallation {
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
