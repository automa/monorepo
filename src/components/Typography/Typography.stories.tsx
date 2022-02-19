import { Meta } from '@storybook/react';

import Typography from './Typography';

export default {
  title: 'Typography',
  component: Typography,
  argTypes: {},
} as Meta;

export const Default = {
  args: {
    children: 'This is text',
  },
};

export const Title1 = {
  args: {
    ...Default.args,
    variant: 'title1',
  },
};

export const AlignLeft = {
  args: {
    ...Default.args,
    textAlign: 'left',
  },
};

export const AlignCenter = {
  args: {
    ...Default.args,
    textAlign: 'center',
  },
};

export const AlignRight = {
  args: {
    ...Default.args,
    textAlign: 'right',
  },
};
