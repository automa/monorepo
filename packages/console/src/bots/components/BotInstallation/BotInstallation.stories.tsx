import { Meta, StoryObj } from '@storybook/react';

import { makeFragmentData } from 'gql';
import { TaskState } from 'gql/graphql';

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
          image_url: 'https://example.com/image.jpg',
          org: {
            id: 1,
            name: 'Org',
          },
        },
        tasks_count: [
          { count: 2, state: TaskState.Started },
          { count: 3, state: TaskState.Completed },
          { count: 1, state: TaskState.Submitted },
          { count: 2, state: TaskState.Skipped },
          { count: 1, state: TaskState.Failed },
          { count: 1, state: TaskState.Cancelled },
        ],
      },
      BOT_INSTALLATION_FRAGMENT,
    ),
  },
} satisfies Meta<typeof BotInstallation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
