import { Meta, StoryObj } from '@storybook/react';

import Input from './Input';

const meta = {
  title: 'Input',
  component: Input,
  args: {
    label: 'Input',
    input: {
      name: 'name',
      required: true,
      placeholder: 'Input',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Optional = {
  args: {
    input: {
      ...meta.args.input,
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
    input: {
      ...meta.args.input,
      disabled: true,
    },
  },
} satisfies Story;
