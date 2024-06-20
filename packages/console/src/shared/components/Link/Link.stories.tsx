import { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';

import { LinkComponentProps } from './types';

import Link from './Link';

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
