import React from 'react';
import { expect, test } from 'vitest';

import { render, screen } from 'tests';

import App from './App';

test('home is default route', async () => {
  render(<App />);
});
