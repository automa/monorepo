import { gql } from 'gql';

export const PUBLIC_BOTS_QUERY = gql(`
  query PublicBots($org_id: Int) {
    publicBots {
      id
      ...PublicBotFragment
    }
  }
`);
