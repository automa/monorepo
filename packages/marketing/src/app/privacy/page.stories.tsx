import { Meta, StoryObj } from '@storybook/react';

import PrivacyPage from './page';

const meta = {
  title: 'PrivacyPage',
  component: PrivacyPage,
} satisfies Meta<typeof PrivacyPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
