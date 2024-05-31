import { expect } from 'vitest';

import { render, mockedNavigate } from 'tests';

import DeepLink from './DeepLink';
import { ProviderType } from '@automa/common';

test('with no orgs does nothing', async () => {
  render(<DeepLink />);

  expect(mockedNavigate).not.toHaveBeenCalled();
});

test('with orgs redirects to first org', async () => {
  const orgs = [
    {
      id: 1,
      name: 'one',
      provider_type: ProviderType.Github,
      provider_id: '1',
      provider_name: 'one',
      has_installation: true,
    },
    {
      id: 2,
      name: 'two',
      provider_type: ProviderType.Github,
      provider_id: '2',
      provider_name: 'two',
      has_installation: true,
    },
  ];

  render(<DeepLink />, {
    path: '/$/settings/bots/new',
    state: {
      orgs: {
        orgs,
        org: null,
        loading: false,
      },
    },
  });

  expect(mockedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedNavigate).toHaveBeenCalledWith({
    to: '/one/settings/bots/new',
    replace: true,
  });
});
