import { expect, test, vi } from 'vitest';

import { mockedNavigate, render, screen } from 'tests';

import AdminSetupCode from './AdminSetupCode';

const app = {
  cloud: true,
  client_uri: 'http://localhost:3000',
  webhook_uri: 'http://test.ngrok.io',
  integrations: {
    github: false,
    gitlab: false,
    linear: false,
    jira: false,
    slack: false,
  },
};

beforeEach(() => {
  vi.clearAllMocks();
});

test('with no github and no gitlab renders', async () => {
  render(<AdminSetupCode />, {
    state: {
      app: {
        app,
      },
    },
  });

  expect(mockedNavigate).toHaveBeenCalledTimes(0);

  expect(screen.getByText('GitHub')).toBeInTheDocument();
  // expect(screen.getByText('GitLab')).toBeInTheDocument();
});

test('with github integration hides the GitHub card', async () => {
  render(<AdminSetupCode />, {
    state: {
      app: {
        app: {
          ...app,
          integrations: {
            ...app.integrations,
            github: true,
          },
        },
      },
    },
  });

  expect(mockedNavigate).toHaveBeenCalledTimes(0);
  expect(screen.queryByText('GitHub')).toBeNull();
});

test('with gitlab integration still shows the GitHub card', async () => {
  render(<AdminSetupCode />, {
    state: {
      app: {
        app: {
          ...app,
          integrations: {
            ...app.integrations,
            gitlab: true,
          },
        },
      },
    },
  });

  expect(mockedNavigate).toHaveBeenCalledTimes(0);
  expect(screen.getByText('GitHub')).toBeInTheDocument();
});
