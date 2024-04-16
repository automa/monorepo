import { Meta, StoryObj } from '@storybook/react';

import DropdownMenu from './DropdownMenu';

const meta = {
  title: 'DropdownMenu',
  component: DropdownMenu,
  args: {
    trigger: 'Trigger',
    children: 'Children',
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
