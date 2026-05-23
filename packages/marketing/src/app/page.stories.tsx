import { Meta, StoryObj } from '@storybook/nextjs-vite';

import AppPage from './page';

const meta = {
  title: 'AppPage',
  component: AppPage,
} satisfies Meta<typeof AppPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
