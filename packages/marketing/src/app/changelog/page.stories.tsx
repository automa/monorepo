import { Meta, StoryObj } from '@storybook/react';

import ChangelogPage from './page';

const meta = {
  title: 'ChangelogPage',
  component: ChangelogPage,
} satisfies Meta<typeof ChangelogPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
