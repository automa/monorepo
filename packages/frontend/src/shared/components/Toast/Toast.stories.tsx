import { Meta, StoryObj } from '@storybook/react';

import Toast from './Toast';
import { ToastComponentProps } from './types';

export default {
  title: 'Toast',
  component: Toast,
  args: {
    children: 'Title',
  },
  argTypes: {},
} as Meta<ToastComponentProps>;

export const Default: StoryObj<ToastComponentProps> = {};

export const Description: StoryObj<ToastComponentProps> = {
  args: {
    description: () => 'Description',
  },
};

export const Action: StoryObj<ToastComponentProps> = {
  args: {
    action: {
      altText: 'Action',
      cta: () => <div>Action</div>,
    },
  },
};

export const Close: StoryObj<ToastComponentProps> = {
  args: {
    close: () => <div>X</div>,
  },
};

export const DescriptionAndAction: StoryObj<ToastComponentProps> = {
  args: {
    ...Description.args,
    ...Action.args,
  },
};

export const DescriptionAndClose: StoryObj<ToastComponentProps> = {
  args: {
    ...Description.args,
    ...Close.args,
  },
};

export const ActionAndClose: StoryObj<ToastComponentProps> = {
  args: {
    ...Action.args,
    ...Close.args,
  },
};

export const DescriptionAndActionAndClose: StoryObj<ToastComponentProps> = {
  args: {
    ...Description.args,
    ...Action.args,
    ...Close.args,
  },
};

export const Error: StoryObj<ToastComponentProps> = {
  args: {
    variant: 'error',
    ...DescriptionAndActionAndClose.args,
  },
};

export const Success: StoryObj<ToastComponentProps> = {
  args: {
    variant: 'success',
    ...DescriptionAndActionAndClose.args,
  },
};

export const Empty: StoryObj<ToastComponentProps> = {
  args: {
    children: null,
  },
};
