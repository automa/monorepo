import { Meta, StoryObj } from '@storybook/react';

import AuthLogout from './AuthLogout';
import { AuthLogoutProps } from './types';

export default {
  title: 'AuthLogout',
  component: AuthLogout,
  args: {},
  argTypes: {},
} as Meta<AuthLogoutProps>;

export const Default: StoryObj<AuthLogoutProps> = {};
