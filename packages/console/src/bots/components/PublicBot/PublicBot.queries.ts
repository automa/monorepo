import { gql } from 'gql';

export const PUBLIC_BOT_FRAGMENT = gql(`
  fragment PublicBotFragment on PublicBot {
    id
    name
    short_description
    org {
      name
    }
    installation(org_id: $org_id) {
      id
    }
  }
`);
