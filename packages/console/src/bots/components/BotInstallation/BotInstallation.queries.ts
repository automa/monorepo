import { gql } from 'gql';

export const BOT_INSTALLATION_FRAGMENT = gql(`
  fragment BotInstallation on BotInstallation {
    id
    created_at
    bot {
      id
      name
      image_url
      org {
        id
        name
      }
    }
    tasks_count {
      state
      count
    }
  }
`);
