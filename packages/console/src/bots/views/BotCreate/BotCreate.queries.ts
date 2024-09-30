import { gql } from 'gql';

export const BOT_CREATE_MUTATION = gql(`
  mutation BotCreate($org_id: Int!, $input: BotCreateInput!) {
    botCreate(org_id: $org_id, input: $input) {
      ...BotBase
    }
  }
`);
