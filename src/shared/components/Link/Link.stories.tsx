import { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import { userEvent, within } from '@storybook/testing-library';

import Link from './Link';
import { LinkComponentProps } from './types';

const meta = {
  title: 'Link',
  component: (props) => <Link {...props} />,
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
} satisfies Meta<LinkComponentProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Clickable = {
  play: async ({ args, canvasElement }) => {
    const { getByText } = within(canvasElement);

    await userEvent.click(getByText('One'));
    expect(args.onClick).toHaveBeenCalled();
  },
} satisfies Story;
