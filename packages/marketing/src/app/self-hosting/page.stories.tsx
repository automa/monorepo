import { Meta, StoryObj } from '@storybook/react';

import SelfHostingPage from './page';

const meta = {
  title: 'SelfHostingPage',
  component: SelfHostingPage,
} satisfies Meta<typeof SelfHostingPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
