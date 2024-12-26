import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { ComboBoxOption } from './types';

import ComboBox from './ComboBox';

const meta = {
  title: 'ComboBox',
  component: (props) => {
    const [value, setValue] = useState(props.value);

    return <ComboBox {...props} value={value} onChange={setValue} />;
  },
  args: {
    label: 'ComboBox',
    name: 'name',
    onChange: console.log,
    placeholder: 'Select',
    emptyText: 'No items found.',
    options: [
      { id: 1, value: 'Apple', icon: '🍎' },
      { id: 2, value: 'Banana', icon: '🍌', disabled: true },
      { id: 3, value: 'Cherry', icon: '🍒' },
    ],
    renderOption: ({ value, icon }) => (
      <span>
        {icon} {value}
      </span>
    ),
  },
} satisfies Meta<
  typeof ComboBox<
    ComboBoxOption & {
      icon: string;
    }
  >
>;

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

export const WithValue = {
  args: {
    value: 3,
  },
} satisfies Story;

export const Loading = {
  args: {
    loading: true,
  },
} satisfies Story;
