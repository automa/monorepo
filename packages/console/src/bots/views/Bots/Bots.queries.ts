import { gql } from 'gql';

export const BOTS_QUERY = gql(`
  query Bots($org_id: Int!) {
    bots(org_id: $org_id) {
      id
      ...BotBase
    }
  }
`);
