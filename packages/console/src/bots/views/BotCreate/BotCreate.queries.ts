import { gql } from 'gql';

export const BOT_CREATE_MUTATION = gql(`
  mutation BotCreate($input: BotCreateInput!) {
    botCreate(input: $input) {
      ...BotFragment
    }
  }
`);
