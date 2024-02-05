import { Meta, StoryObj } from '@storybook/react';

import ScreenSize from './ScreenSize';

const meta = {
  title: 'ScreenSize',
  component: ScreenSize,
} satisfies Meta<typeof ScreenSize>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BelowTablet = {
  args: {
    max: 'tablet',
    children: <div>Below tablet</div>,
  },
} satisfies Story;

export const AboveTablet = {
  args: {
    min: 'tablet',
    children: <div>Above tablet</div>,
  },
} satisfies Story;
