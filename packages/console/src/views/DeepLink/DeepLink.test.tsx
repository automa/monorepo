import { expect } from 'vitest';

import { mockedNavigate, render } from 'tests';

import { ProviderType } from 'gql/graphql';

import DeepLink from './DeepLink';

test('with no orgs does nothing', async () => {
  render(<DeepLink />);

  expect(mockedNavigate).toHaveBeenCalledTimes(0);
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
      bot_installations_count: 1,
    },
    {
      id: 2,
      name: 'two',
      provider_type: ProviderType.Github,
      provider_id: '2',
      provider_name: 'two',
      has_installation: true,
      bot_installations_count: 1,
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
