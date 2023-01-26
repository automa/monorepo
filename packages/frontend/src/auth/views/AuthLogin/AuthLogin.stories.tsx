import { Meta, StoryObj } from '@storybook/react';

import AuthLogin from './AuthLogin';
import { AuthLoginProps } from './types';

export default {
  title: 'AuthLogin',
  component: AuthLogin,
  args: {},
  argTypes: {},
} as Meta<AuthLoginProps>;

export const Default: StoryObj<AuthLoginProps> = {};
