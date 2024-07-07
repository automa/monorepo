import { gql } from 'gql';

export const BOT_FRAGMENT = gql(`
  fragment BotFragment on Bot {
    id
    ...BotBaseFragment
  }
`);
