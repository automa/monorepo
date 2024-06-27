import { gql } from 'gql';

export const BOT_FRAGMENT = gql(`
  fragment BotFragment on Bot {
    id
    name
    short_description
    image_url
    type
    is_published
    is_preview
    is_deterministic
  }
`);
