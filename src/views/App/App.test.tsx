import React from 'react';

import { render, screen } from 'tests';

import App from './App';

test('home is default route', async () => {
  render(<App />);

  const headline = await screen.findByText('Home');
  expect(headline).toBeInTheDocument();
});
