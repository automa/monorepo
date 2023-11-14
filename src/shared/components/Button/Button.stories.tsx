import { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import { userEvent, within } from '@storybook/testing-library';

import Button from './Button';
import { ButtonComponentProps } from './types';

export default {
  title: 'Button',
  component: Button,
  args: {
    children: 'One',
  },
  argTypes: {
    onClick: {
      action: true,
    },
  },
} as Meta<ButtonComponentProps>;

export const Default: StoryObj<ButtonComponentProps> = {};

export const Disabled: StoryObj<ButtonComponentProps> = {
  args: {
    disabled: true,
  },
};

export const Secondary: StoryObj<ButtonComponentProps> = {
  args: {
    variant: 'secondary',
  },
};

export const SecondaryDisabled: StoryObj<ButtonComponentProps> = {
  args: {
    ...Secondary.args,
    ...Disabled.args,
  },
};

export const Tertiary: StoryObj<ButtonComponentProps> = {
  args: {
    variant: 'tertiary',
  },
};

export const TertiaryDisabled: StoryObj<ButtonComponentProps> = {
  args: {
    ...Tertiary.args,
    ...Disabled.args,
  },
};

export const Small: StoryObj<ButtonComponentProps> = {
  args: {
    size: 'small',
  },
};

export const SmallSecondary: StoryObj<ButtonComponentProps> = {
  args: {
    ...Small.args,
    ...Secondary.args,
  },
};

export const SmallTertiary: StoryObj<ButtonComponentProps> = {
  args: {
    ...Small.args,
    ...Tertiary.args,
  },
};

export const Large: StoryObj<ButtonComponentProps> = {
  args: {
    size: 'large',
  },
};

export const LargeSecondary: StoryObj<ButtonComponentProps> = {
  args: {
    ...Large.args,
    ...Secondary.args,
  },
};

export const LargeTertiary: StoryObj<ButtonComponentProps> = {
  args: {
    ...Large.args,
    ...Tertiary.args,
  },
};

export const FullWidth: StoryObj<ButtonComponentProps> = {
  args: {
    fullWidth: true,
  },
};

export const Clickable: StoryObj<ButtonComponentProps> = {
  args: {},
  play: async ({ args, canvasElement }) => {
    const { getByText } = within(canvasElement);

    await userEvent.click(getByText('One'));
    expect(args.onClick).toHaveBeenCalled();
  },
};

export const NonClickable: StoryObj<ButtonComponentProps> = {
  args: {
    ...Disabled.args,
  },
  play: async ({ args, canvasElement }) => {
    const { getByText } = within(canvasElement);

    await userEvent.click(getByText('One'));
    expect(args.onClick).not.toHaveBeenCalled();
  },
};
