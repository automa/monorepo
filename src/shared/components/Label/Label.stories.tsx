import { Meta, StoryObj } from '@storybook/react';

import Label from './Label';

const meta = {
  title: 'Label',
  component: Label,
  args: {
    label: 'Label',
    optional: false,
    name: 'label',
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Optional = {
  args: {
    optional: true,
  },
} satisfies Story;
