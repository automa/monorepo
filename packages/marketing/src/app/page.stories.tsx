import { Meta, StoryObj } from '@storybook/react';

import AppPage from './page';

const meta = {
  title: 'AppPage',
  component: AppPage,
} satisfies Meta<typeof AppPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
