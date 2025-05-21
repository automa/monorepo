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

export const Ghost = {
  args: {
    variant: 'ghost',
  },
} satisfies Story;

export const GhostIcon = {
  args: {
    ...Ghost.args,
    ...Icon.args,
  },
} satisfies Story;

export const GhostDisabled = {
  args: {
    ...Ghost.args,
    ...Disabled.args,
  },
} satisfies Story;

export const GhostActive = {
  args: {
    variant: 'ghostActive',
  },
} satisfies Story;

export const GhostActiveIcon = {
  args: {
    ...GhostActive.args,
    ...Icon.args,
  },
} satisfies Story;

export const GhostActiveDisabled = {
  args: {
    ...GhostActive.args,
    ...Disabled.args,
  },
} satisfies Story;

export const Danger = {
  args: {
    variant: 'danger',
  },
} satisfies Story;

export const DangerIcon = {
  args: {
    ...Danger.args,
    ...Icon.args,
  },
} satisfies Story;

export const DangerDisabled = {
  args: {
    ...Danger.args,
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

export const SmallGhost = {
  args: {
    ...Small.args,
    ...Ghost.args,
  },
} satisfies Story;

export const SmallGhostIcon = {
  args: {
    ...Small.args,
    ...Ghost.args,
    ...Icon.args,
  },
} satisfies Story;

export const SmallGhostActive = {
  args: {
    ...Small.args,
    ...GhostActive.args,
  },
} satisfies Story;

export const SmallGhostActiveIcon = {
  args: {
    ...Small.args,
    ...GhostActive.args,
    ...Icon.args,
  },
} satisfies Story;

export const SmallDanger = {
  args: {
    ...Small.args,
    ...Danger.args,
  },
} satisfies Story;

export const SmallDangerIcon = {
  args: {
    ...Small.args,
    ...Danger.args,
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

export const LargeGhost = {
  args: {
    ...Large.args,
    ...Ghost.args,
  },
} satisfies Story;

export const LargeGhostIcon = {
  args: {
    ...Large.args,
    ...Ghost.args,
    ...Icon.args,
  },
} satisfies Story;

export const LargeGhostActive = {
  args: {
    ...Large.args,
    ...GhostActive.args,
  },
} satisfies Story;

export const LargeGhostActiveIcon = {
  args: {
    ...Large.args,
    ...GhostActive.args,
    ...Icon.args,
  },
} satisfies Story;

export const LargeDanger = {
  args: {
    ...Large.args,
    ...Danger.args,
  },
} satisfies Story;

export const LargeDangerIcon = {
  args: {
    ...Large.args,
    ...Danger.args,
    ...Icon.args,
  },
} satisfies Story;

export const ExtraSmall = {
  args: {
    size: 'xsmall',
  },
} satisfies Story;

export const ExtraSmallIcon = {
  args: {
    ...ExtraSmall.args,
    ...Icon.args,
  },
} satisfies Story;

export const ExtraSmallSecondary = {
  args: {
    ...ExtraSmall.args,
    ...Secondary.args,
  },
} satisfies Story;

export const ExtraSmallSecondaryIcon = {
  args: {
    ...ExtraSmall.args,
    ...Secondary.args,
    ...Icon.args,
  },
} satisfies Story;

export const ExtraSmallTertiary = {
  args: {
    ...ExtraSmall.args,
    ...Tertiary.args,
  },
} satisfies Story;

export const ExtraSmallTertiaryIcon = {
  args: {
    ...ExtraSmall.args,
    ...Tertiary.args,
    ...Icon.args,
  },
} satisfies Story;

export const ExtraSmallGhost = {
  args: {
    ...ExtraSmall.args,
    ...Ghost.args,
  },
} satisfies Story;

export const ExtraSmallGhostIcon = {
  args: {
    ...ExtraSmall.args,
    ...Ghost.args,
    ...Icon.args,
  },
} satisfies Story;

export const ExtraSmallGhostActive = {
  args: {
    ...ExtraSmall.args,
    ...GhostActive.args,
  },
} satisfies Story;

export const ExtraSmallGhostActiveIcon = {
  args: {
    ...ExtraSmall.args,
    ...GhostActive.args,
    ...Icon.args,
  },
} satisfies Story;

export const ExtraSmallDanger = {
  args: {
    ...ExtraSmall.args,
    ...Danger.args,
  },
} satisfies Story;

export const ExtraSmallDangerIcon = {
  args: {
    ...ExtraSmall.args,
    ...Danger.args,
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
