import { Meta, StoryObj } from '@storybook/react';

import { ProviderType } from '@automa/common';

import RepoOnboarding from './RepoOnboarding';

const meta = {
  title: 'RepoOnboarding',
  component: RepoOnboarding,
  args: {
    org: {
      id: 1,
      name: 'org',
      provider_type: ProviderType.Github,
      provider_id: '1',
      provider_name: 'org',
      has_installation: true,
      bot_installations_count: 1,
    },
  },
} satisfies Meta<typeof RepoOnboarding>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
