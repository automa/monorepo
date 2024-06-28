import { Meta, StoryObj } from '@storybook/react';

import Anchor from './Anchor';

const meta = {
  title: 'Anchor',
  component: Anchor,
  args: {
    children: 'Children',
  },
} satisfies Meta<typeof Anchor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Link = {
  args: {
    to: '/',
  },
} satisfies Story;

export const Href = {
  args: {
    href: 'https://google.com',
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
  },
} satisfies Story;

export const Blank = {
  args: {
    ...Href.args,
    blank: true,
  },
} satisfies Story;
