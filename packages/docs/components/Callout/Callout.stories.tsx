import { Meta, StoryObj } from '@storybook/react';
import { Warning } from '@phosphor-icons/react';

import Callout from './Callout';
import { CalloutProps } from './types';

export default {
  title: 'Callout',
  component: Callout,
  args: {
    children: 'Callout',
    icon: Warning,
  },
  argTypes: {},
} as Meta<CalloutProps>;

export const Default: StoryObj<CalloutProps> = {};
