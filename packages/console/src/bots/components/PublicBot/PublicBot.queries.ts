import { gql } from 'gql';

export const PUBLIC_BOT_FRAGMENT = gql(`
  fragment PublicBotFragment on PublicBot {
    id
    ...BotBaseFragment
    org {
      name
    }
    installation(org_id: $org_id) {
      id
    }
  }
`);
