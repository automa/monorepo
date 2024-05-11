import { Meta, StoryObj } from '@storybook/react';

import DeepLink from './DeepLink';

const meta = {
  title: 'DeepLink',
  component: DeepLink,
} satisfies Meta<typeof DeepLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
