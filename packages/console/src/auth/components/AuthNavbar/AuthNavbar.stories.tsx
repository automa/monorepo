import { Meta, StoryObj } from '@storybook/react';

import AuthNavbar from './AuthNavbar';
import { AuthNavbarProps } from './types';

export default {
  title: 'AuthNavbar',
  component: AuthNavbar,
  args: {},
  argTypes: {},
} as Meta<AuthNavbarProps>;

export const Default: StoryObj<AuthNavbarProps> = {};
