import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { sha256 } from 'crypto-hash';
import axios from 'axios';

const persistedQueryLink = createPersistedQueryLink({
  sha256,
  useGETForHashedQueries: true,
});

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI,
  credentials: 'include',
});

const client = new ApolloClient({
  link: persistedQueryLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
    },
  },
});

axios.defaults.baseURL = import.meta.env.VITE_API_URI;
axios.defaults.withCredentials = true;

export default client;
