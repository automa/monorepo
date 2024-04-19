import { Meta, StoryObj } from '@storybook/react';

import Dialog from './Dialog';

const meta = {
  title: 'Dialog',
  component: Dialog,
  args: {
    trigger: 'Trigger',
    title: 'Title',
    description: 'Description',
    children: 'Children',
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
