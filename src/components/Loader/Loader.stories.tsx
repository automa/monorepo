import { Meta, StoryObj } from '@storybook/react';

import Loader from './Loader';
import { LoaderProps } from './types';

export default {
  title: 'Loader',
  component: Loader,
  args: {},
  argTypes: {},
} as Meta<LoaderProps>;

export const Default: StoryObj<LoaderProps> = {};
