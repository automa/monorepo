import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from 'tests';

import OrgOverview from './OrgOverview';

test('renders', async () => {
  render(<OrgOverview />);
});
