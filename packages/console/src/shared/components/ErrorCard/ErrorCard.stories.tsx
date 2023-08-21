import { Meta, StoryObj } from '@storybook/react';

import ErrorCard from './ErrorCard';
import { ErrorCardComponentProps } from './types';

export default {
  title: 'ErrorCard',
  component: ErrorCard,
  args: {
    error: new Error('Error message'),
  },
  argTypes: {},
} as Meta<ErrorCardComponentProps>;

export const Default: StoryObj<ErrorCardComponentProps> = {};

export const WithoutMessage: StoryObj<ErrorCardComponentProps> = {
  args: {
    error: undefined,
  },
};
