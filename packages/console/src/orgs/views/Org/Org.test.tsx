import { expect } from 'vitest';

import { mockedUseNavigate, render } from 'tests';

import { ProviderType } from 'gql/graphql';

import Org from './Org';

test('deep link with orgs redirects to first org', async () => {
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

  render(
    {
      path: ':orgName',
      Component: Org,
      children: [
        {
          path: 'settings/bots/new',
          Component: () => null,
        },
      ],
    },
    {
      uri: '/$/settings/bots/new',
      state: {
        orgs: {
          orgs,
          org: null,
          loading: false,
        },
      },
    },
  );

  expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
  expect(mockedUseNavigate).toHaveBeenCalledWith('/one/settings/bots/new', {
    replace: true,
  });
});
