import { Meta, StoryObj } from '@storybook/react';

import { ProviderType } from 'gql/graphql';

import Bot from './Bot';

const meta = {
  title: 'BotView',
  component: Bot,
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
  parameters: {
    state: {
      app: {
        app: {
          cloud: true,
        },
      },
    },
  },
} satisfies Meta<typeof Bot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
