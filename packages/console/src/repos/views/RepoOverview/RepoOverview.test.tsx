import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from 'tests';

import RepoOverview from './RepoOverview';

test('renders', async () => {
  render(<RepoOverview />);
});
