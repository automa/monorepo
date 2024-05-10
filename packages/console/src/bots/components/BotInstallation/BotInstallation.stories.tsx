import { Meta, StoryObj } from '@storybook/react';

import { ProviderType } from '@automa/common';

import { makeFragmentData } from 'gql';

import BotInstallation from './BotInstallation';
import { BOT_INSTALLATION_FRAGMENT } from './BotInstallation.queries';

const meta = {
  title: 'BotInstallation',
  component: BotInstallation,
  args: {
    botInstallation: makeFragmentData(
      {
        id: 1,
        created_at: '2021-08-14T00:00:00Z',
        bot: {
          name: 'Bot',
          org: {
            provider_type: ProviderType.Github,
            name: 'Org',
          },
        },
      },
      BOT_INSTALLATION_FRAGMENT,
    ),
  },
} satisfies Meta<typeof BotInstallation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
