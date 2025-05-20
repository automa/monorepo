import { Meta, StoryObj } from '@storybook/react';

import BotInstallation from './BotInstallation';

const meta = {
  title: 'BotInstallation',
  component: BotInstallation,
} satisfies Meta<typeof BotInstallation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
