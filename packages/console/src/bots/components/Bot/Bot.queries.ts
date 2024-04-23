import { gql } from 'gql';

export const BOT_FRAGMENT = gql(`
  fragment BotFragment on Bot {
    id
    name
    description
    type
    webhook_url
    homepage
    published_at
    is_published
    created_at
  }
`);
