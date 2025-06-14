import { Meta, StoryObj } from '@storybook/react';

import AdminSetup from './AdminSetup';

const meta = {
  title: 'AdminSetup',
  component: AdminSetup,
} satisfies Meta<typeof AdminSetup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
