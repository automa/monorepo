import { Meta, StoryObj } from '@storybook/react';

import Avatar from './Avatar';

const meta = {
  title: 'Avatar',
  component: Avatar,
  args: {
    src: 'https://avatars.githubusercontent.com/u/3055950?size=32',
    alt: 'Avatar',
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Small = {
  args: {
    size: 'small',
  },
} satisfies Story;

export const Large = {
  args: {
    size: 'large',
  },
} satisfies Story;

export const Fallback = {
  args: {
    src: null,
  },
} satisfies Story;

export const FallbackSmall = {
  args: {
    ...Fallback.args,
    ...Small.args,
  },
} satisfies Story;

export const FallbackLarge = {
  args: {
    ...Fallback.args,
    ...Large.args,
  },
} satisfies Story;
