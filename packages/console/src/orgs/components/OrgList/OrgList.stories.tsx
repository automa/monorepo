import { Meta, StoryObj } from '@storybook/react';

import { ProviderType } from '@automa/common';

import { makeFragmentData } from 'gql';

import OrgList from './OrgList';
import { ORGS_QUERY_FRAGMENT } from './OrgList.queries';

const meta = {
  title: 'OrgList',
  component: OrgList,
  args: {
    data: makeFragmentData(
      {
        orgs: [
          {
            id: 1,
            name: 'automa',
            provider_type: ProviderType.Github,
            provider_id: '65730741',
            provider_name: 'automa',
            has_installation: true,
            botInstallationsCount: 1,
          },
          {
            id: 2,
            name: 'pksunkara',
            provider_type: ProviderType.Github,
            provider_id: '174703',
            provider_name: 'pksunkara',
            has_installation: false,
            botInstallationsCount: 1,
          },
        ],
      },
      ORGS_QUERY_FRAGMENT,
    ),
  },
} satisfies Meta<typeof OrgList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Empty = {
  args: {
    data: makeFragmentData(
      {
        orgs: [],
      },
      ORGS_QUERY_FRAGMENT,
    ),
  },
} satisfies Story;
