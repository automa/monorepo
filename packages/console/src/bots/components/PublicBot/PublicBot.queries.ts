import { gql } from 'gql';

export const PUBLIC_BOT_FRAGMENT = gql(`
  fragment PublicBotFragment on PublicBot {
    id
    name
    short_description
    image_url
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
`);
