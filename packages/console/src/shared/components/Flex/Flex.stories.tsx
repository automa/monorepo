import { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import { userEvent, within } from '@storybook/testing-library';

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
  argTypes: {
    onClick: {
      action: true,
    },
  },
} as Meta<FlexProps>;

export const Default: StoryObj<FlexProps> = {};

export const Gap: StoryObj<FlexProps> = {
  args: {
    gap: 2,
  },
};

export const Clickable: StoryObj<FlexProps> = {
  args: {},
  play: async ({ args, canvasElement }) => {
    const { getByText } = within(canvasElement);

    userEvent.click(getByText('One'));
    expect(args.onClick).toHaveBeenCalled();
  },
};
