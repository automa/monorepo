import { Meta, StoryObj } from '@storybook/nextjs-vite';

import PrivacyPage from './page';

const meta = {
  title: 'PrivacyPage',
  component: PrivacyPage,
} satisfies Meta<typeof PrivacyPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
