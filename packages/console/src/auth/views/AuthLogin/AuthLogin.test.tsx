import { expect, test, vi } from 'vitest';

import { mockedNavigate, render } from 'tests';

import AuthLogin from './AuthLogin';

const app = {
  cloud: true,
  client_uri: 'http://localhost:3000',
  webhook_uri: 'http://test.ngrok.io',
  integrations: {
    github: true,
    gitlab: false,
    linear: false,
    jira: false,
    slack: false,
  },
};

beforeEach(() => {
  vi.clearAllMocks();
});

test('with no github and no gitlab redirects to /admin/setup', async () => {
  render(<AuthLogin />, {
    state: {
      app: {
        app: {
          ...app,
          integrations: {
            ...app.integrations,
            github: false,
          },
        },
      },
    },
  });

  expect(mockedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedNavigate).toHaveBeenCalledWith({
    to: '/admin/setup',
    replace: true,
  });
});

test('with github and with no user renders', async () => {
  render(<AuthLogin />, {
    state: {
      app: {
        app,
      },
    },
  });

  expect(mockedNavigate).toHaveBeenCalledTimes(0);
});

test('with github and user redirects to /', async () => {
  render(<AuthLogin />, {
    state: {
      app: {
        app,
      },
      auth: {
        user: {
          id: '1',
          email: 'john@example.com',
          org_id: '1',
        },
      },
    },
  });

  expect(mockedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedNavigate).toHaveBeenCalledWith({ to: '/' });
});
