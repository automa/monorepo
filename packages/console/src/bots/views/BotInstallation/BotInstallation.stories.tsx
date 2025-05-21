import { Meta, StoryObj } from '@storybook/react';

import { ProviderType } from 'gql/graphql';

import BotInstallation from './BotInstallation';

const meta = {
  title: 'BotInstallationView',
  component: BotInstallation,
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
} satisfies Meta<typeof BotInstallation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
