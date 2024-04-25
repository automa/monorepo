import { Meta, StoryObj } from '@storybook/react';

import DropdownMenu, {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './DropdownMenu';

const meta = {
  title: 'DropdownMenu',
  component: DropdownMenu,
  args: {
    trigger: 'Trigger',
    children: <DropdownMenuItem>Children</DropdownMenuItem>,
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Label = {
  args: {
    children: <DropdownMenuLabel>Label</DropdownMenuLabel>,
  },
} satisfies Story;

export const Separator = {
  args: {
    children: <DropdownMenuSeparator />,
  },
} satisfies Story;
