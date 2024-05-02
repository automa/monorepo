import React from 'react';
import { expect, test } from 'vitest';

import { mockedNavigate, mockedUseNavigate, render } from 'tests';

import AuthLogin from './AuthLogin';

test('with no user renders', async () => {
  render(<AuthLogin />);

  expect(mockedUseNavigate).toHaveBeenCalledTimes(0);
  expect(mockedNavigate).toHaveBeenCalledTimes(0);
});

test('with user redirects to /', async () => {
  render(<AuthLogin />, {
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

  expect(mockedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedNavigate).toHaveBeenCalledWith({ to: '/' });
});
