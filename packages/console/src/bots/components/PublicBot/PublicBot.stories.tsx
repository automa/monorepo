import { Meta, StoryObj } from '@storybook/react';

import { ProviderType } from '@automa/common';

import { makeFragmentData } from 'gql';

import PublicBot from './PublicBot';

import { PUBLIC_BOT_FRAGMENT } from './PublicBot.queries';

const publicBot = {
  id: 1,
  name: 'Bot',
  short_description: 'Bot description',
  is_published: true,
  is_preview: false,
  is_deterministic: false,
  org: {
    name: 'Org',
  },
  installation: null,
};

const meta = {
  title: 'PublicBot',
  component: PublicBot,
  args: {
    publicBot: makeFragmentData(publicBot, PUBLIC_BOT_FRAGMENT),
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

export const Installed = {
  args: {
    publicBot: makeFragmentData(
      {
        ...publicBot,
        installation: {
          id: 1,
        },
      },
      PUBLIC_BOT_FRAGMENT,
    ),
  },
} satisfies Story;

export const NonPublished = {
  args: {
    publicBot: makeFragmentData(
      {
        ...publicBot,
        is_published: false,
      },
      PUBLIC_BOT_FRAGMENT,
    ),
  },
} satisfies Story;

export const NonPublishedInstalled = {
  args: {
    publicBot: makeFragmentData(
      {
        ...publicBot,
        is_published: false,
        installation: {
          id: 1,
        },
      },
      PUBLIC_BOT_FRAGMENT,
    ),
  },
} satisfies Story;
