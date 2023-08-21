import { Meta, StoryObj } from '@storybook/react';

import Footer from './Footer';
import { FooterProps } from './types';

export default {
  title: 'Footer',
  component: Footer,
  args: {},
  argTypes: {},
} as Meta<FooterProps>;

export const Default: StoryObj<FooterProps> = {};
