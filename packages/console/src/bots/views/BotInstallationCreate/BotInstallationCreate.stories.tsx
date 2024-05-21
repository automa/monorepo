import { Meta, StoryObj } from '@storybook/react';

import BotInstallationCreate from './BotInstallationCreate';

const meta = {
  title: 'BotInstallationCreate',
  component: BotInstallationCreate,
} satisfies Meta<typeof BotInstallationCreate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
