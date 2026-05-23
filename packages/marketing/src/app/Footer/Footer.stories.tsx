import { Meta, StoryObj } from '@storybook/nextjs-vite';

import Footer from './Footer';

const meta = {
  title: 'Footer',
  component: Footer,
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
