import { Meta, StoryObj } from '@storybook/react';

import { ProviderType } from '@automa/common';

import OrgOnboarding from './OrgOnboarding';

const meta = {
  title: 'OrgOnboarding',
  component: OrgOnboarding,
  args: {
    org: {
      id: 1,
      name: 'org',
      provider_type: ProviderType.Github,
      provider_id: '1',
      provider_name: 'org',
      has_installation: true,
    },
  },
} satisfies Meta<typeof OrgOnboarding>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
