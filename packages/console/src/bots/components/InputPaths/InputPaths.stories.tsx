import { Meta, StoryObj } from '@storybook/react';

import InputPaths from './InputPaths';

const meta = {
  title: 'InputPaths',
  component: InputPaths,
  args: {
    label: 'Label',
    name: 'name',
  },
} satisfies Meta<typeof InputPaths>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Optional = {
  args: {
    optional: true,
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
    disabled: true,
  },
} satisfies Story;

export const Placeholder = {
  args: {
    placeholder: 'Placeholder',
  },
} satisfies Story;

export const Value = {
  args: {
    value: ['foo', 'bar'],
  },
} satisfies Story;

export const DisabledValue = {
  args: {
    ...Disabled.args,
    ...Value.args,
  },
} satisfies Story;
