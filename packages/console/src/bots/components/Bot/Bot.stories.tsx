import { Meta, StoryObj } from '@storybook/react';

import { BotType } from '@automa/common';

import { makeFragmentData } from 'gql';

import Bot from './Bot';
import { BOT_FRAGMENT } from './Bot.queries';

const meta = {
  title: 'Bot',
  component: Bot,
  args: {
    bot: makeFragmentData(
      {
        id: 1,
        name: 'Bot',
        description: 'Bot description',
        type: BotType.Webhook,
        webhook_url: 'https://example.com',
        homepage: 'https://example.com',
        published_at: null,
        is_published: false,
        created_at: '2021-08-14T00:00:00Z',
      },
      BOT_FRAGMENT,
    ),
  },
  argTypes: {},
} satisfies Meta<typeof Bot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
