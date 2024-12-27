import { gql } from 'gql';

export const BOT_INSTALLATION_FRAGMENT = gql(`
  fragment BotInstallation on BotInstallation {
    id
    created_at
    bot {
      id
      name
      short_description
      image_url
      org {
        id
        name
      }
    }
  }
`);
