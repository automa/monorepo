import React from 'react';
import { test } from 'vitest';
import userEvent from '@testing-library/user-event';

import { render, screen } from 'tests';

import AuthLogout from './AuthLogout';

test('renders', async () => {
  render(<AuthLogout />);
});
