import { Meta } from '@storybook/react';

import ScreenSize from './ScreenSize';

export default {
  title: 'ScreenSize',
  component: ScreenSize,
  argTypes: {},
} as Meta;

export const BelowTablet = {
  args: {
    max: 'tablet',
    children: <div>Below tablet</div>,
  },
};

export const AboveTablet = {
  args: {
    min: 'tablet',
    children: <div>Above tablet</div>,
  },
};
