import { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import { userEvent, within } from '@storybook/testing-library';

import Flex from './Flex';
import { FlexComponentProps } from './types';

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
  },
  argTypes: {
    onClick: {
      action: true,
    },
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
