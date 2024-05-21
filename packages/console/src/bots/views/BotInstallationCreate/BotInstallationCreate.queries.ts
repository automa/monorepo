import { gql } from 'gql';

export const PUBLIC_BOTS_QUERY = gql(`
  query PublicBots {
    publicBots {
      id
      ...PublicBotFragment
    }
  }
`);
