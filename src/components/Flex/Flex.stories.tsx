import { Meta, StoryObj } from '@storybook/react';

import Flex from './Flex';
import { FlexProps } from './types';

export default {
  title: 'Flex',
  component: Flex,
  args: {
    children: (
      <>
        <div>One</div>
        <div>Two</div>
      </>
    ),
  },
  argTypes: {},
} as Meta<FlexProps>;

export const Default: StoryObj<FlexProps> = {};

export const Gap: StoryObj<FlexProps> = {
  args: {
    gap: 2,
  },
};
