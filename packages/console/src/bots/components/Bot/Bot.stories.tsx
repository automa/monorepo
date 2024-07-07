import { Meta, StoryObj } from '@storybook/react';

import { BotType } from '@automa/common';

import { makeFragmentData } from 'gql';

import Bot from './Bot';

import { BOT_FRAGMENT } from './Bot.queries';

const bot = {
  id: 1,
  name: 'Bot',
  short_description: 'Bot description',
  type: BotType.Event,
  is_published: true,
  is_preview: false,
  is_deterministic: false,
};

const meta = {
  title: 'Bot',
  component: Bot,
  args: {
    bot: makeFragmentData(bot, BOT_FRAGMENT),
  },
} satisfies Meta<typeof Bot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
