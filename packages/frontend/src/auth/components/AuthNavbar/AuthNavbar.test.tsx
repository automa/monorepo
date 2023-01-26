import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from 'tests';

import AuthNavbar from './AuthNavbar';

test('interaction', async () => {
  render(<AuthNavbar />);
});
