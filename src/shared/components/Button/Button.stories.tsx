import { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { Gear } from '@phosphor-icons/react';

import { ButtonComponentProps } from './types';

import Button from './Button';

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

export const Link = {
  args: {
    to: '/',
  },
} satisfies Story;

export const Anchor = {
  args: {
    href: 'https://google.com',
  },
} satisfies Story;

export const Icon = {
  args: {
    icon: true,
    children: <Gear />,
  },
} satisfies Story;

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

export const SecondaryIcon = {
  args: {
    ...Secondary.args,
    ...Icon.args,
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

export const TertiaryIcon = {
  args: {
    ...Tertiary.args,
    ...Icon.args,
  },
} satisfies Story;

export const TertiaryDisabled = {
  args: {
    ...Tertiary.args,
    ...Disabled.args,
  },
} satisfies Story;

export const Small = {
  args: {
    size: 'small',
  },
} satisfies Story;

export const SmallIcon = {
  args: {
    ...Small.args,
    ...Icon.args,
  },
} satisfies Story;

export const SmallSecondary = {
  args: {
    ...Small.args,
    ...Secondary.args,
  },
} satisfies Story;

export const SmallSecondaryIcon = {
  args: {
    ...Small.args,
    ...Secondary.args,
    ...Icon.args,
  },
} satisfies Story;

export const SmallTertiary = {
  args: {
    ...Small.args,
    ...Tertiary.args,
  },
} satisfies Story;

export const SmallTertiaryIcon = {
  args: {
    ...Small.args,
    ...Tertiary.args,
    ...Icon.args,
  },
} satisfies Story;

export const Large = {
  args: {
    size: 'large',
  },
} satisfies Story;

export const LargeIcon = {
  args: {
    ...Large.args,
    ...Icon.args,
  },
} satisfies Story;

export const LargeSecondary = {
  args: {
    ...Large.args,
    ...Secondary.args,
  },
} satisfies Story;

export const LargeSecondaryIcon = {
  args: {
    ...Large.args,
    ...Secondary.args,
    ...Icon.args,
  },
} satisfies Story;

export const LargeTertiary = {
  args: {
    ...Large.args,
    ...Tertiary.args,
  },
} satisfies Story;

export const LargeTertiaryIcon = {
  args: {
    ...Large.args,
    ...Tertiary.args,
    ...Icon.args,
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
