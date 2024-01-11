import { Meta, StoryObj } from '@storybook/react';

import { ProviderType } from '@automa/common';

import { makeFragmentData } from 'gql';

import OrgList from './OrgList';
import { ORGS_QUERY_FRAGMENT } from './OrgList.queries';
import { OrgListProps } from './types';

export default {
  title: 'OrgList',
  component: OrgList,
  argTypes: {},
} as Meta<OrgListProps>;

export const Default: StoryObj<OrgListProps> = {
  args: {
    data: makeFragmentData(
      {
        orgs: [
          {
            id: 1,
            name: 'automa',
            provider_type: ProviderType.Github,
            has_installation: true,
          },
          {
            id: 2,
            name: 'pksunkara',
            provider_type: ProviderType.Github,
            has_installation: false,
          },
        ],
      },
      ORGS_QUERY_FRAGMENT,
    ),
  },
};

export const Empty: StoryObj<OrgListProps> = {
  args: {
    data: makeFragmentData(
      {
        orgs: [],
      },
      ORGS_QUERY_FRAGMENT,
    ),
  },
};
