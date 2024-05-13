import { Meta, StoryObj } from '@storybook/react';

import Changelog from './Changelog';

const meta = {
  title: 'Changelog',
  component: Changelog,
  args: {
    path: 'content/changelog/2024-06-01-launch.mdx',
  },
} satisfies Meta<typeof Changelog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
