import { Meta, StoryObj } from '@storybook/react';

import AuthLogout from './AuthLogout';

const meta = {
  title: 'AuthLogout',
  component: AuthLogout,
} satisfies Meta<typeof AuthLogout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
