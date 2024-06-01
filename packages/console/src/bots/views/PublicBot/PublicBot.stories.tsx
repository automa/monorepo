import { Meta, StoryObj } from '@storybook/react';

import { ProviderType } from '@automa/common';

import PublicBot from './PublicBot';

const meta = {
  title: 'PublicBotView',
  component: PublicBot,
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
} satisfies Meta<typeof PublicBot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
