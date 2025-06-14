import { expect, test, vi } from 'vitest';

import { mockedNavigate, render } from 'tests';

import AdminSetup from './AdminSetup';

beforeEach(() => {
  vi.clearAllMocks();
});

test('redirects to /admin/setup/code', async () => {
  render(<AdminSetup />, {
    history: ['/admin/setup'],
  });

  expect(mockedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedNavigate).toHaveBeenCalledWith({
    to: '/admin/setup/code',
    replace: true,
  });
});
