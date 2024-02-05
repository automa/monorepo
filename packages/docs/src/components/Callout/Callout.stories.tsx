import { Meta, StoryObj } from '@storybook/react';
import { Warning } from '@phosphor-icons/react';

import Callout from './Callout';

const meta = {
  title: 'Callout',
  component: Callout,
  args: {
    children: 'Callout',
    icon: Warning,
  },
} satisfies Meta<typeof Callout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Error = {
  args: {
    type: 'error',
  },
} satisfies Story;
