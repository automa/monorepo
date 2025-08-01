import { beforeEach, expect, test, vi } from 'vitest';

import { mockedAxios, mockedNavigate, render, waitFor } from 'tests';

import AuthLogout from './AuthLogout';

beforeEach(() => {
  vi.clearAllMocks();
});

test('with no user redirects to login', async () => {
  render(<AuthLogout />);

  expect(mockedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedNavigate).toHaveBeenCalledWith({ to: '../login' });
});

test('with user logs them out and redirects to login', async () => {
  mockedAxios.mockResolvedValue({ data: null });

  const { store } = render(<AuthLogout />, {
    state: {
      auth: {
        user: {
          id: '1',
          email: 'john@example.com',
          org_id: '1',
        },
      },
    },
  });

  await waitFor(() => {
    expect(mockedAxios).toHaveBeenCalledTimes(1);
  });

  expect(mockedAxios).toHaveBeenCalledWith('/auth/logout');

  expect(mockedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedNavigate).toHaveBeenCalledWith({ to: '../login' });

  expect(store.getState().auth).toEqual({
    user: null,
  });
});
