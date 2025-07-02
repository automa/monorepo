import { describe, expect, it } from 'vitest';

import { ProviderType } from 'gql/graphql';

import { type Org } from 'orgs/types';

import reducer, {
  setOrg,
  setOrgBotInstallationsCount,
  setOrgs,
  setOrgsLoading,
  unsetOrgs,
} from './orgs';

const dummyOrgs: Org[] = [
  {
    id: 1,
    name: 'org1',
    provider_type: ProviderType.Github,
    provider_id: '1',
    provider_name: 'org1',
    has_installation: false,
    bot_installations_count: 0,
  },
  {
    id: 2,
    name: 'org2',
    provider_type: ProviderType.Github,
    provider_id: '2',
    provider_name: 'org2',
    has_installation: false,
    bot_installations_count: 0,
  },
];

describe('orgsReducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({
      orgs: null,
      org: null,
      loading: true,
    });
  });

  it('should set orgs', () => {
    expect(reducer(undefined, setOrgs(dummyOrgs))).toEqual({
      orgs: dummyOrgs,
      org: null,
      loading: false,
    });
  });

  it('should unset orgs', () => {
    const result = reducer(
      {
        orgs: dummyOrgs,
        org: dummyOrgs[1],
        loading: true,
      },
      unsetOrgs(),
    );

    expect(result).toEqual({
      orgs: null,
      org: null,
      loading: false,
    });
  });

  it('should set org', () => {
    const result = reducer(
      {
        orgs: dummyOrgs,
        org: null,
        loading: false,
      },
      setOrg('org2'),
    );

    expect(result).toEqual({
      orgs: dummyOrgs,
      org: dummyOrgs[1],
      loading: false,
    });
  });

  it('should not set org when it is not in orgs', () => {
    const result = reducer(
      {
        orgs: dummyOrgs,
        org: null,
        loading: false,
      },
      setOrg('org3'),
    );

    expect(result).toEqual({
      orgs: dummyOrgs,
      org: null,
      loading: false,
    });
  });

  it('should set orgs bot_installations_count', () => {
    const result = reducer(
      {
        orgs: dummyOrgs,
        org: null,
        loading: false,
      },
      setOrgBotInstallationsCount({ name: 'org1', count: 5 }),
    );

    expect(result).toEqual({
      orgs: [
        {
          ...dummyOrgs[0],
          bot_installations_count: 5,
        },
        dummyOrgs[1],
      ],
      org: null,
      loading: false,
    });
  });

  it('should set org bot_installations_count', () => {
    const result = reducer(
      {
        orgs: dummyOrgs,
        org: dummyOrgs[0],
        loading: false,
      },
      setOrgBotInstallationsCount({ name: 'org1', count: 5 }),
    );

    expect(result).toEqual({
      orgs: [
        {
          ...dummyOrgs[0],
          bot_installations_count: 5,
        },
        dummyOrgs[1],
      ],
      org: {
        ...dummyOrgs[0],
        bot_installations_count: 5,
      },
      loading: false,
    });
  });

  it('should set orgs loading', () => {
    const result = reducer(
      {
        orgs: null,
        org: null,
        loading: false,
      },
      setOrgsLoading(true),
    );

    expect(result).toEqual({
      orgs: null,
      org: null,
      loading: true,
    });
  });
});
