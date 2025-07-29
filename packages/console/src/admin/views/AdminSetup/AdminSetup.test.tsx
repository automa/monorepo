import { expect, test, vi } from 'vitest';

import { mockedNavigate, render } from 'tests';

import AdminSetup from './AdminSetup';

beforeEach(() => {
  vi.clearAllMocks();
});

test('redirects to /admin/setup/code', async () => {
  render({
    Component: AdminSetup,
  });

  expect(mockedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedNavigate).toHaveBeenCalledWith({
    to: 'code',
    replace: true,
  });
});
