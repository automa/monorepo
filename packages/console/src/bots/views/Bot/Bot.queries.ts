import { gql } from 'gql';

export const BOT_FRAGMENT = gql(`
  fragment Bot on Bot {
    id
    name
    short_description
    type
    webhook_url
    webhook_secret
    draft_paths
    image_url
    description
    homepage
    is_published
    is_preview
    is_deterministic
  }
`);

export const BOT_QUERY = gql(`
  query Bot(
    $org_id: Int!
    $name: String!
  ) {
    bot(org_id: $org_id, name: $name) {
      ...Bot
    }
  }
`);

export const BOT_UPDATE_MUTATION = gql(`
  mutation BotUpdate($org_id: Int!, $name: String!, $input: BotUpdateInput!) {
    botUpdate(org_id: $org_id, name: $name, input: $input) {
      ...Bot
    }
  }
`);
