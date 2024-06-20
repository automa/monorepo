import { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';

import { FlexComponentProps } from './types';

import Flex from './Flex';

const meta = {
  title: 'Flex',
  component: Flex,
  args: {
    children: (
      <>
        <div>One</div>
        <div>Two</div>
      </>
    ),
    onClick: fn(),
  },
} satisfies Meta<FlexComponentProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Direction = {
  args: {
    direction: 'column',
  },
} satisfies Story;

export const JustifyContent = {
  args: {
    justifyContent: 'space-between',
  },
} satisfies Story;

export const AlignItems = {
  args: {
    ...Direction.args,
    alignItems: 'flex-end',
  },
} satisfies Story;

export const Element = {
  args: {
    element: 'nav',
  },
} satisfies Story;

export const Inline = {
  args: {
    inline: true,
  },
} satisfies Story;

export const FullWidth = {
  args: {
    fullWidth: true,
  },
} satisfies Story;

export const Clickable = {
  play: async ({ args, canvasElement }) => {
    const { getByText } = within(canvasElement);

    await userEvent.click(getByText('One'));
    expect(args.onClick).toHaveBeenCalled();
  },
} satisfies Story;
