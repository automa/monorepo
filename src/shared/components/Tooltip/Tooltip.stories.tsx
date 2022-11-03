import { Meta, StoryObj } from '@storybook/react';

import Tooltip from './Tooltip';
import { TooltipComponentProps } from './types';

export default {
  title: 'Tooltip',
  component: Tooltip,
  args: {
    children: 'Children',
    content: () => 'Content',
  },
  argTypes: {},
} as Meta<TooltipComponentProps>;

export const Default: StoryObj<TooltipComponentProps> = {};
