import { Meta, StoryObj } from '@storybook/react';

import Textarea from './Textarea';

const meta = {
  title: 'Textarea',
  component: Textarea,
  args: {
    label: 'Textarea',
    textarea: {
      name: 'name',
      placeholder: 'Textarea',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Optional = {
  args: {
    optional: true,
  },
} satisfies Story;

export const Error = {
  args: {
    error: 'Error',
  },
} satisfies Story;
