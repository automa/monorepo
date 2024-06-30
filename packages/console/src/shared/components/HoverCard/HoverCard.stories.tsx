import { Meta, StoryObj } from '@storybook/react';

import HoverCard from './HoverCard';

const meta = {
  title: 'HoverCard',
  component: HoverCard,
  args: {
    trigger: 'Trigger',
    children: 'Children',
  },
} satisfies Meta<typeof HoverCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
