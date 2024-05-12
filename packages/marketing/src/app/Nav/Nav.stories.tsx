import { Meta, StoryObj } from '@storybook/react';

import Nav from './Nav';

const meta = {
  title: 'Nav',
  component: Nav,
} satisfies Meta<typeof Nav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
