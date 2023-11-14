import { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import { userEvent, within } from '@storybook/testing-library';

import Link from './Link';
import { LinkComponentProps } from './types';

export default {
  title: 'Link',
  component: Link,
  args: {
    to: '/path',
    children: 'One',
    activeColor: 'red',
  },
  argTypes: {
    onClick: {
      action: true,
    },
  },
} as Meta<LinkComponentProps>;

export const Default: StoryObj<LinkComponentProps> = {};

export const Clickable: StoryObj<LinkComponentProps> = {
  args: {},
  play: async ({ args, canvasElement }) => {
    const { getByText } = within(canvasElement);

    await userEvent.click(getByText('One'));
    expect(args.onClick).toHaveBeenCalled();
  },
};
