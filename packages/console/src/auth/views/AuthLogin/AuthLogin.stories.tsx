import { Meta, StoryObj } from '@storybook/react';

import AuthLogin from './AuthLogin';

const meta = {
  title: 'AuthLogin',
  component: AuthLogin,
} satisfies Meta<typeof AuthLogin>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
