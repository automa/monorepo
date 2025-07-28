import { Meta, StoryObj } from '@storybook/react';

import { ProviderType } from 'gql/graphql';

import PublicBot from './PublicBot';

const meta = {
  title: 'PublicBotView',
  component: PublicBot,
  parameters: {
    route: {
      context: {
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
    },
  },
} satisfies Meta<typeof PublicBot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
