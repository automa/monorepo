import { Meta, StoryObj } from '@storybook/react';

import { ProviderType } from '@automa/common';

import { makeFragmentData } from 'gql';

import PublicBot from './PublicBot';

import { PUBLIC_BOT_FRAGMENT } from './PublicBot.queries';

const meta = {
  title: 'PublicBot',
  component: PublicBot,
  args: {
    publicBot: makeFragmentData(
      {
        id: 1,
        name: 'Bot',
        short_description: 'Bot description',
        org: {
          name: 'Org',
        },
      },
      PUBLIC_BOT_FRAGMENT,
    ),
  },
  parameters: {
    state: {
      orgs: {
        orgs: [
          {
            id: 1,
            name: 'org',
            provider_type: ProviderType.Github,
            provider_id: '1',
            provider_name: 'org',
            has_installation: true,
          },
        ],
        org: {
          id: 1,
          name: 'org',
          provider_type: ProviderType.Github,
          provider_id: '1',
          provider_name: 'org',
          has_installation: true,
        },
        loading: false,
      },
    },
  },
} satisfies Meta<typeof PublicBot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
