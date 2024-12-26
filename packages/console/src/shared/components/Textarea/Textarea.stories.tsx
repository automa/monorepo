import { Meta, StoryObj } from '@storybook/react';

import Textarea from './Textarea';

const meta = {
  title: 'Textarea',
  component: Textarea,
  args: {
    label: 'Textarea',
    textarea: {
      name: 'name',
      required: true,
      placeholder: 'Textarea',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Optional = {
  args: {
    textarea: {
      ...meta.args.textarea,
      required: false,
    },
  },
} satisfies Story;

export const Description = {
  args: {
    description: 'Description',
  },
} satisfies Story;

export const Error = {
  args: {
    error: 'Error',
  },
} satisfies Story;

export const Disabled = {
  args: {
    textarea: {
      ...meta.args.textarea,
      disabled: true,
    },
  },
} satisfies Story;
