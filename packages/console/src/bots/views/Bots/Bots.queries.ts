import { gql } from 'gql';

export const BOTS_QUERY = gql(`
  query Bots($provider_type: ProviderType!, $name: String!) {
    org(provider_type: $provider_type, name: $name) {
      bots {
        id
        ...BotFragment
      }
    }
  }
`);
