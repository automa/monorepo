import { Meta, StoryObj } from '@storybook/react';

import Home from './Home';
import { HomeProps } from './types';

export default {
  title: 'Home',
  component: Home,
  argTypes: {},
} as Meta<HomeProps>;

export const Default: StoryObj<HomeProps> = {
  args: {},
};
