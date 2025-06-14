import { Meta, StoryObj } from '@storybook/react';

import AdminSetupGithub from './AdminSetupGithub';

const meta = {
  title: 'AdminSetupGithub',
  component: AdminSetupGithub,
} satisfies Meta<typeof AdminSetupGithub>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
