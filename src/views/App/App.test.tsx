import { render, screen } from 'tests';

import App from './App';

test('renders children', async () => {
  render({
    Component: App,
    children: [
      {
        path: '',
        Component: () => 'child',
      },
    ],
  });

  const child = await screen.findByText('child');

  expect(child).toBeInTheDocument();
});
