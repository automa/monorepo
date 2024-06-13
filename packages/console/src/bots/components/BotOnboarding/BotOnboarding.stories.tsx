import { Meta, StoryObj } from '@storybook/react';

import { ProviderType } from '@automa/common';

import BotOnboarding from './BotOnboarding';

const meta = {
  title: 'BotOnboarding',
  component: BotOnboarding,
  args: {
    org: {
      id: 1,
      name: 'org',
      provider_type: ProviderType.Github,
      provider_id: '1',
      provider_name: 'org',
      has_installation: true,
      botInstallationsCount: 1,
    },
  },
} satisfies Meta<typeof BotOnboarding>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
