import { gql } from 'gql';

export const PUBLIC_BOTS_QUERY = gql(`
  query PublicBots($org_id: Int!, $filter: PublicBotsFilter) {
    publicBots(filter: $filter) {
      id
      ...PublicBot
    }
  }
`);
