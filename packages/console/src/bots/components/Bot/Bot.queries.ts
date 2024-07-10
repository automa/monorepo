import { gql } from 'gql';

export const BOT_FRAGMENT = gql(`
  fragment Bot on Bot {
    id
    ...BotBase
  }
`);
