import { Meta, StoryObj } from '@storybook/react';

import AuthNavbar from './AuthNavbar';

const meta = {
  title: 'AuthNavbar',
  component: AuthNavbar,
} satisfies Meta<typeof AuthNavbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
