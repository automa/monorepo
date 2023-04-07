import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from 'tests';

import AuthLogin from './AuthLogin';

test('renders', async () => {
  render(<AuthLogin />);
});
