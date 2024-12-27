import { Meta, StoryObj } from '@storybook/react';

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
          id: 1,
          name: 'Bot',
          short_description: 'Short description',
          image_url: 'https://example.com/image.jpg',
          org: {
            id: 1,
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
