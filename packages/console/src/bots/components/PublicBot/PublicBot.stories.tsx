import { Meta, StoryObj } from '@storybook/react';

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
        description: 'Bot description',
        org: {
          name: 'Org',
        },
      },
      PUBLIC_BOT_FRAGMENT,
    ),
  },
} satisfies Meta<typeof PublicBot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
