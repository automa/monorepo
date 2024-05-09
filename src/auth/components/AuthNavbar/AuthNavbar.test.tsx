import { test } from 'vitest';
import userEvent from '@testing-library/user-event';

import { render, screen } from 'tests';

import AuthNavbar from './AuthNavbar';

test('renders', async () => {
  render(<AuthNavbar />);
});
