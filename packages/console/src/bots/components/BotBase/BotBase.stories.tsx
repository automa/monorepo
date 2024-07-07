import { Meta, StoryObj } from '@storybook/react';

import { BotType } from '@automa/common';

import { makeFragmentData } from 'gql';

import BotBase from './BotBase';

import { BOT_BASE_FRAGMENT } from './BotBase.queries';

const bot = {
  id: 1,
  name: 'Bot',
  type: BotType.Event,
  short_description: 'Bot description',
  is_published: true,
  is_preview: false,
  is_deterministic: false,
};

const meta = {
  title: 'BotBase',
  component: BotBase,
  args: {
    bot: makeFragmentData(bot, BOT_BASE_FRAGMENT),
  },
} satisfies Meta<typeof BotBase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Scheduled = {
  args: {
    bot: makeFragmentData(
      {
        ...bot,
        type: BotType.Scheduled,
      },
      BOT_BASE_FRAGMENT,
    ),
  },
} satisfies Story;

export const NonPublished = {
  args: {
    bot: makeFragmentData(
      {
        ...bot,
        is_published: false,
      },
      BOT_BASE_FRAGMENT,
    ),
  },
} satisfies Story;

export const Deterministic = {
  args: {
    bot: makeFragmentData(
      {
        ...bot,
        is_deterministic: true,
      },
      BOT_BASE_FRAGMENT,
    ),
  },
} satisfies Story;

export const Preview = {
  args: {
    bot: makeFragmentData(
      {
        ...bot,
        is_preview: true,
      },
      BOT_BASE_FRAGMENT,
    ),
  },
} satisfies Story;

export const NonPublishedPreview = {
  args: {
    bot: makeFragmentData(
      {
        ...bot,
        is_published: false,
        is_preview: true,
      },
      BOT_BASE_FRAGMENT,
    ),
  },
} satisfies Story;
