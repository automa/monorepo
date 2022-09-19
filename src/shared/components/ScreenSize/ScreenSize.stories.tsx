import { Meta, StoryObj } from '@storybook/react';

import ScreenSize from './ScreenSize';
import { ScreenSizeProps } from './types';

export default {
  title: 'ScreenSize',
  component: ScreenSize,
  argTypes: {},
} as Meta<ScreenSizeProps>;

export const BelowTablet: StoryObj<ScreenSizeProps> = {
  args: {
    max: 'tablet',
    children: <div>Below tablet</div>,
  },
};

export const AboveTablet: StoryObj<ScreenSizeProps> = {
  args: {
    min: 'tablet',
    children: <div>Above tablet</div>,
  },
};
