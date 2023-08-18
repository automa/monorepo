import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import axios from 'axios';

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_API_URI}/api/graphql`,
  credentials: 'include',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

axios.defaults.baseURL = import.meta.env.VITE_API_URI;
axios.defaults.withCredentials = true;

export default client;
