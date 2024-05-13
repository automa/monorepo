import { Meta, StoryObj } from '@storybook/react';

import ManifestoPage from './page';

const meta = {
  title: 'ManifestoPage',
  component: ManifestoPage,
} satisfies Meta<typeof ManifestoPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
