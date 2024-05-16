import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { sha256 } from 'crypto-hash';
import axios from 'axios';

import { isProduction } from 'env';

const persistedQueryLink = createPersistedQueryLink({
  sha256,
  useGETForHashedQueries: true,
});

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI,
  credentials: 'include',
});

export const cache = new InMemoryCache();

const client = new ApolloClient({
  link: persistedQueryLink.concat(httpLink),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-and-network',
    },
  },
  connectToDevTools: !isProduction,
});

axios.defaults.baseURL = import.meta.env.VITE_API_URI;
axios.defaults.withCredentials = true;

export default client;
