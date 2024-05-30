import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { RetryLink } from '@apollo/client/link/retry';
import { onError } from '@apollo/client/link/error';
import { print } from 'graphql';
import { sha256 } from 'crypto-hash';
import axios from 'axios';

import { isProduction } from 'env';
import { errorCapture } from 'error';

import { toast } from 'shared';
import { logout } from 'auth';

const logoutOn401 = async () => {
  await logout();

  toast({
    title: 'You are not logged in.',
    variant: 'error',
  });
};

const persistedQueryLink = createPersistedQueryLink({
  sha256,
  useGETForHashedQueries: true,
});

const retryLink = new RetryLink({
  attempts: {
    // Do not retry on 4xx/5xx graphql errors
    retryIf: (error) => !error.result?.errors,
  },
});

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI,
  credentials: 'include',
});

const badErrorCodes = [
  'GRAPHQL_VALIDATION_FAILED',
  'BAD_USER_INPUT',
  'PERSISTED_QUERY_NOT_SUPPORTED',
  'OPERATION_RESOLUTION_FAILURE',
];

const ignoredErrorCodes = ['PERSISTED_QUERY_NOT_FOUND'];

const errorLink = onError(
  ({ graphQLErrors, networkError, operation: { query, variables } }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach((error) => {
        const {
          extensions: { code },
        } = error;

        if (badErrorCodes.includes(code as string)) {
          errorCapture(error, {
            query: print(query),
            variables: JSON.stringify(variables),
          });
        }

        if (code === 'UNAUTHORIZED') {
          logoutOn401();
        } else if (!ignoredErrorCodes.includes(code as string)) {
          toast({
            title: 'Something went wrong. We are looking into it.',
            variant: 'error',
          });
        }
      });
    }

    if (networkError && !graphQLErrors) {
      toast({
        title: 'Network issues. Please try again later.',
        variant: 'error',
      });
    }
  },
);

export const cache = new InMemoryCache();

const client = new ApolloClient({
  link: ApolloLink.from([persistedQueryLink, errorLink, retryLink, httpLink]),
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

const badStatusCodes = [400, 405, 415, 422];

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const code = error.response?.status;

    if (badStatusCodes.includes(code)) {
      errorCapture(error, {
        url: error.config.url,
        method: error.config.method,
        data: JSON.stringify(error.config.data),
        headers: JSON.stringify(error.config.headers),
      });
    }

    if (code === 401) {
      logoutOn401();
    } else {
      toast({
        title: 'Something went wrong. We are looking into it.',
        variant: 'error',
      });
    }

    return Promise.reject(error);
  },
);

export default client;
