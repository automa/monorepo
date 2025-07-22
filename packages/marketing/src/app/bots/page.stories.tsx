import { Meta, StoryObj } from '@storybook/react';

import BotsPage from './page';

const meta = {
  title: 'BotsPage',
  component: BotsPage,
} satisfies Meta<typeof BotsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
