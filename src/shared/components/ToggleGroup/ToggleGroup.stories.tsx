import { Meta, StoryObj } from '@storybook/react';

import ToggleGroup from './ToggleGroup';

const meta = {
  title: 'ToggleGroup',
  component: ToggleGroup,
  args: {
    defaultValue: 'left',
    options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' },
    ],
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Multiple = {
  args: {
    type: 'multiple',
    defaultValue: ['left', 'right'],
  },
} satisfies Story;

export const Large = {
  args: {
    size: 'large',
  },
} satisfies Story;

export const Optional = {
  args: {
    optional: true,
  },
} satisfies Story;

export const MultipleOptional = {
  args: {
    ...Multiple.args,
    ...Optional.args,
  },
} satisfies Story;
