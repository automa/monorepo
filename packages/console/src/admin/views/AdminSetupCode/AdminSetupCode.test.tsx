import { expect, test, vi } from 'vitest';

import { mockedNavigate, render, screen } from 'tests';

import AdminSetupCode from './AdminSetupCode';

beforeEach(() => {
  vi.clearAllMocks();
});

test('with no github and no gitlab renders', async () => {
  render(<AdminSetupCode />, {
    state: {
      app: {
        app: {
          cloud: true,
          client_uri: 'http://localhost:3000',
          integrations: {
            github: false,
            gitlab: false,
            linear: false,
            jira: false,
            slack: false,
          },
        },
      },
    },
  });

  expect(mockedNavigate).toHaveBeenCalledTimes(0);

  expect(screen.getByText('GitHub')).toBeInTheDocument();
  // expect(screen.getByText('GitLab')).toBeInTheDocument();
});

test('with github redirects to /', async () => {
  render(<AdminSetupCode />, {
    state: {
      app: {
        app: {
          cloud: true,
          client_uri: 'http://localhost:3000',
          integrations: {
            github: true,
            gitlab: false,
            linear: false,
            jira: false,
            slack: false,
          },
        },
      },
    },
  });

  expect(mockedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedNavigate).toHaveBeenCalledWith({ to: '/', replace: true });
});

test('with gitlab redirects to /', async () => {
  render(<AdminSetupCode />, {
    state: {
      app: {
        app: {
          cloud: true,
          client_uri: 'http://localhost:3000',
          integrations: {
            github: false,
            gitlab: true,
            linear: false,
            jira: false,
            slack: false,
          },
        },
      },
    },
  });

  expect(mockedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedNavigate).toHaveBeenCalledWith({ to: '/', replace: true });
});
