import { Meta, StoryObj } from '@storybook/react';

import Flex from '../Flex';

import Select, { SelectItem } from './Select';

const meta = {
  title: 'Select',
  component: Select,
  args: {
    label: 'Select',
    select: {
      name: 'name',
      placeholder: 'Select',
    },
    children: (
      <>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana" disabled>
          Banana
        </SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </>
    ),
  },
} satisfies Meta<typeof Select>;

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
    select: {
      ...meta.args.select,
      disabled: true,
    },
  },
} satisfies Story;
