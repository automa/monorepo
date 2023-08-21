import { Meta, StoryObj } from '@storybook/react';

import Logo from './Logo';
import { LogoProps } from './types';

export default {
  title: 'Logo',
  component: Logo,
  args: {},
  argTypes: {},
} as Meta<LogoProps>;

export const Default: StoryObj<LogoProps> = {};
