import { Meta, StoryObj } from '@storybook/react';

import ErrorCard from './ErrorCard';

const meta = {
  title: 'ErrorCard',
  component: ErrorCard,
  args: {
    error: new Error('Error message'),
  },
} satisfies Meta<typeof ErrorCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const WithoutMessage = {
  args: {
    error: undefined,
  },
} satisfies Story;
