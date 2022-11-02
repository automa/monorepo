import { Meta, StoryObj } from '@storybook/react';

import Link from './Link';
import { LinkProps } from './types';

export default {
  title: 'Link',
  component: Link,
  args: {
    to: '/path',
    children: 'Children',
    variant: 'title1',
    color: 'body',
  },
  argTypes: {},
} as Meta<LinkProps>;

export const Default: StoryObj<LinkProps> = {};
