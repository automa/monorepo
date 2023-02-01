import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from 'tests';

import OrgOverview from './OrgOverview';

test('interaction', async () => {
  render(<OrgOverview />);
});
