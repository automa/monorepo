import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

import InputEditor from './InputEditor';

const meta = {
  title: 'InputEditor',
  component: (props) => {
    const [value, onChange] = useState(props.value);

    return <InputEditor {...props} value={value} onChange={onChange} />;
  },
  args: {
    label: 'InputEditor',
    name: 'name',
    placeholder: 'InputEditor',
    value: null,
    onChange: () => {},
  },
} satisfies Meta<typeof InputEditor>;

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
