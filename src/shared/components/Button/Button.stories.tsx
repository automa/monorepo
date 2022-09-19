import { Meta, StoryObj } from '@storybook/react';

import Button from './Button';
import { ButtonComponentProps } from './types';

export default {
  title: 'Button',
  component: Button,
  args: {
    children: 'Children',
  },
  argTypes: {},
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
    variant: 'secondary',
    disabled: true,
  },
};

export const Tertiary: StoryObj<ButtonComponentProps> = {
  args: {
    variant: 'tertiary',
  },
};

export const TertiaryDisabled: StoryObj<ButtonComponentProps> = {
  args: {
    variant: 'tertiary',
    disabled: true,
  },
};

export const Small: StoryObj<ButtonComponentProps> = {
  args: {
    size: 'small',
  },
};

export const SmallSecondary: StoryObj<ButtonComponentProps> = {
  args: {
    size: 'small',
    variant: 'secondary',
  },
};

export const SmallTertiary: StoryObj<ButtonComponentProps> = {
  args: {
    size: 'small',
    variant: 'tertiary',
  },
};

export const Large: StoryObj<ButtonComponentProps> = {
  args: {
    size: 'large',
  },
};

export const LargeSecondary: StoryObj<ButtonComponentProps> = {
  args: {
    size: 'large',
    variant: 'secondary',
  },
};

export const LargeTertiary: StoryObj<ButtonComponentProps> = {
  args: {
    size: 'large',
    variant: 'tertiary',
  },
};

export const FullWidth: StoryObj<ButtonComponentProps> = {
  args: {
    fullWidth: true,
  },
};
