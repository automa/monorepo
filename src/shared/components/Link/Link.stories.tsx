import { Meta, StoryObj } from '@storybook/react';

import Link from './Link';
import { LinkComponentProps } from './types';

export default {
  title: 'Link',
  component: Link,
  args: {
    to: '/path',
    children: 'Children',
    variant: 'title1',
    color: 'body',
    activeColor: 'black',
  },
  argTypes: {},
} as Meta<LinkComponentProps>;

export const Default: StoryObj<LinkComponentProps> = {};
