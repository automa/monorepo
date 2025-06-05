import { Meta, StoryObj } from '@storybook/react';

import AgentsPage from './page';

const meta = {
  title: 'AgentsPage',
  component: AgentsPage,
} satisfies Meta<typeof AgentsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
