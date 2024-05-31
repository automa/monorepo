import { Meta, StoryObj } from '@storybook/react';

import { ProviderType } from '@automa/common';

import BotInstallationCreate from './BotInstallationCreate';

const meta = {
  title: 'BotInstallationCreate',
  component: BotInstallationCreate,
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
} satisfies Meta<typeof BotInstallationCreate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
