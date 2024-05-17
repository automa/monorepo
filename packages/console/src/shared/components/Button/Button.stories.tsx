import { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';

import Button from './Button';
import { ButtonComponentProps } from './types';

const meta = {
  title: 'Button',
  component: Button,
  args: {
    children: 'One',
    onClick: fn(),
  },
} satisfies Meta<ButtonComponentProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
  },
} satisfies Story;

export const Secondary = {
  args: {
    variant: 'secondary',
  },
} satisfies Story;

export const SecondaryDisabled = {
  args: {
    ...Secondary.args,
    ...Disabled.args,
  },
} satisfies Story;

export const Tertiary = {
  args: {
    variant: 'tertiary',
  },
} satisfies Story;

export const TertiaryDisabled = {
  args: {
    ...Tertiary.args,
    ...Disabled.args,
  },
} satisfies Story;

export const Ghost = {
  args: {
    variant: 'ghost',
  },
} satisfies Story;

export const GhostDisabled = {
  args: {
    ...Ghost.args,
    ...Disabled.args,
  },
} satisfies Story;

export const Small = {
  args: {
    size: 'small',
  },
} satisfies Story;

export const SmallSecondary = {
  args: {
    ...Small.args,
    ...Secondary.args,
  },
} satisfies Story;

export const SmallTertiary = {
  args: {
    ...Small.args,
    ...Tertiary.args,
  },
} satisfies Story;

export const SmallGhost = {
  args: {
    ...Small.args,
    ...Ghost.args,
  },
} satisfies Story;

export const Large = {
  args: {
    size: 'large',
  },
} satisfies Story;

export const LargeSecondary = {
  args: {
    ...Large.args,
    ...Secondary.args,
  },
} satisfies Story;

export const LargeTertiary = {
  args: {
    ...Large.args,
    ...Tertiary.args,
  },
} satisfies Story;

export const LargeGhost = {
  args: {
    ...Large.args,
    ...Ghost.args,
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

export const NonClickable = {
  ...Disabled,
  play: async ({ args, canvasElement }) => {
    const { getByText } = within(canvasElement);

    await userEvent.click(getByText('One'));
    expect(args.onClick).not.toHaveBeenCalled();
  },
} satisfies Story;
