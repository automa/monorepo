import { Meta, StoryObj } from '@storybook/react';

import { makeFragmentData } from 'gql';
import { BotType } from 'gql/graphql';

import { BOT_BASE_FRAGMENT } from 'bots';

import Bot from './Bot';

const bot = {
  id: 1,
  name: 'Bot',
  short_description: 'Bot description',
  type: BotType.Manual,
  is_published: true,
  is_preview: false,
  is_deterministic: false,
};

const meta = {
  title: 'Bot',
  component: Bot,
  args: {
    bot: makeFragmentData(bot, BOT_BASE_FRAGMENT),
  },
} satisfies Meta<typeof Bot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
