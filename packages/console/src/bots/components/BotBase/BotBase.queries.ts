import { gql } from 'gql';

export const BOT_BASE_FRAGMENT = gql(`
  fragment BotBase on BotBase {
    name
    short_description
    image_url
    type
    is_published
    is_preview
    is_deterministic
  }
`);
