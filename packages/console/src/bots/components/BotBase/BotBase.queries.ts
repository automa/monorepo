import { gql } from 'gql';

export const BOT_BASE_FRAGMENT = gql(`
  fragment BotBase on BotBase {
    id
    name
    short_description
    type
    image_url
    is_published
    is_preview
    is_deterministic
  }
`);
