import { Meta, StoryObj } from '@storybook/nextjs-vite';

import PricingPage from './page';

const meta = {
  title: 'PricingPage',
  component: PricingPage,
} satisfies Meta<typeof PricingPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
