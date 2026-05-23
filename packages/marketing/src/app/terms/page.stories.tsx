import { Meta, StoryObj } from '@storybook/nextjs-vite';

import TermsPage from './page';

const meta = {
  title: 'TermsPage',
  component: TermsPage,
} satisfies Meta<typeof TermsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
