import { gql } from 'gql';

export const PUBLIC_BOT_FRAGMENT = gql(`
  fragment PublicBot on PublicBot {
    ...BotBase
    org {
      name
    }
    installation(org_id: $org_id) {
      id
    }
  }
`);
