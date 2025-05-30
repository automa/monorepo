import { Meta, StoryObj } from '@storybook/react';

import AdminSetupCode from './AdminSetupCode';

const meta = {
  title: 'AdminSetupCode',
  component: AdminSetupCode,
} satisfies Meta<typeof AdminSetupCode>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
