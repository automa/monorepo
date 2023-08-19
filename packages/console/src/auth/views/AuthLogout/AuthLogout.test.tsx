import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from 'tests';

import AuthLogout from './AuthLogout';

test('renders', async () => {
  render(<AuthLogout />);
});
