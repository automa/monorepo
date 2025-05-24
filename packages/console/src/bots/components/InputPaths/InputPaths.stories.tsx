import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import InputPaths from './InputPaths';

const meta = {
  title: 'InputPaths',
  component: (props) => {
    const [value, onChange] = useState(props.value);

    return <InputPaths {...props} value={value} onChange={onChange} />;
  },
  args: {
    label: 'Label',
    name: 'name',
    value: [],
    onChange: () => {},
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

export const KeyEnter = {
  play: async ({ canvasElement }) => {
    const { getByTestId } = within(canvasElement);

    await userEvent.type(getByTestId('InputPaths-name'), 'src');
    await userEvent.keyboard('{enter}');

    expect(getByTestId('InputPathsX-src')).toBeInTheDocument();
  },
} satisfies Story;

export const KeyComma = {
  play: async ({ canvasElement }) => {
    const { getByTestId } = within(canvasElement);

    await userEvent.type(getByTestId('InputPaths-name'), 'src,');

    expect(getByTestId('InputPathsX-src')).toBeInTheDocument();
  },
} satisfies Story;

export const ClickDelete = {
  ...Value,
  play: async ({ canvasElement }) => {
    const { getByTestId, queryByTestId } = within(canvasElement);

    await userEvent.click(getByTestId('InputPathsX-foo'));

    expect(queryByTestId('InputPathsX-foo')).not.toBeInTheDocument();
    expect(getByTestId('InputPathsX-bar')).toBeInTheDocument();
  },
} satisfies Story;
