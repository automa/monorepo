import React from 'react';
import { expect, test } from 'vitest';

import { render, mockedNavigate, waitFor } from 'tests';

import AuthLogout from './AuthLogout';

test('with no user redirects to login', async () => {
  render(<AuthLogout />);

  expect(mockedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedNavigate).toHaveBeenCalledWith({ to: '/auth/login' });
});

test('with user logs them out and redirects to login', async () => {
  const { store } = render(<AuthLogout />, {
    state: {
      auth: {
        loading: false,
        user: {
          id: '1',
          email: 'john@example.com',
          org_id: '1',
        },
      },
    },
  });

  await waitFor(() => {
    expect(mockedNavigate).toHaveBeenCalledTimes(1);
  });

  expect(mockedNavigate).toHaveBeenCalledWith({ to: '/auth/login' });

  expect(store.getState().auth).toEqual({
    loading: false,
    user: null,
  });
});
