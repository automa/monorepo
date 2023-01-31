import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import axios from 'axios';

const httpLink = new HttpLink({
  uri: `${process.env.REACT_APP_API_URI}/api/graphql`,
  credentials: 'include',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

axios.defaults.baseURL = process.env.REACT_APP_API_URI;
axios.defaults.withCredentials = true;

export default client;
