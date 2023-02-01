import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from 'tests';

import OrgList from './OrgList';

test('interaction', async () => {
  render(<OrgList />);
});
