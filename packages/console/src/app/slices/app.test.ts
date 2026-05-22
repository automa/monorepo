import { App } from 'gql/graphql';

import reducer, { setApp, unsetApp } from './app';

const dummyApp: App = {
  client_uri: 'http://localhost:3000',
  webhook_uri: 'http://test.ngrok.io',
  cloud: true,
  integrations: {
    github: true,
    gitlab: false,
    jira: false,
    linear: false,
    slack: true,
  },
};

describe('appReducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({ app: null });
  });

  test('should set app', () => {
    expect(reducer({ app: null }, setApp(dummyApp))).toEqual({ app: dummyApp });
  });

  test('should unset app', () => {
    expect(reducer({ app: dummyApp }, unsetApp())).toEqual({ app: null });
  });
});
