import { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';

import Link from './Link';
import { LinkComponentProps } from './types';

const meta = {
  title: 'Link',
  component: (props) => <Link {...props} />,
  args: {
    to: '/path',
    children: 'One',
    onClick: fn(),
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
