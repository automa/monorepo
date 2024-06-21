import { Meta, StoryObj } from '@storybook/react';

import Badge from './Badge';

const meta = {
  title: 'Badge',
  component: Badge,
  args: {
    children: 'Children',
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Success = {
  args: {
    variant: 'success',
  },
} satisfies Story;

export const Warning = {
  args: {
    variant: 'warning',
  },
} satisfies Story;

export const Error = {
  args: {
    variant: 'error',
  },
} satisfies Story;

export const Large = {
  args: {
    size: 'large',
  },
} satisfies Story;
