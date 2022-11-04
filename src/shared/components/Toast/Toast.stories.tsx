import { Meta, StoryObj } from '@storybook/react';

import Toast from './Toast';
import { ToastComponentProps } from './types';

export default {
  title: 'Toast',
  component: Toast,
  args: {
    children: 'Description',
  },
  argTypes: {},
} as Meta<ToastComponentProps>;

export const Default: StoryObj<ToastComponentProps> = {};

export const Title: StoryObj<ToastComponentProps> = {
  args: {
    title: 'Title',
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

export const TitleAndAction: StoryObj<ToastComponentProps> = {
  args: {
    ...Title.args,
    ...Action.args,
  },
};

export const TitleAndClose: StoryObj<ToastComponentProps> = {
  args: {
    ...Title.args,
    ...Close.args,
  },
};

export const ActionAndClose: StoryObj<ToastComponentProps> = {
  args: {
    ...Action.args,
    ...Close.args,
  },
};

export const TitleAndActionAndClose: StoryObj<ToastComponentProps> = {
  args: {
    ...Title.args,
    ...Action.args,
    ...Close.args,
  },
};

export const Error: StoryObj<ToastComponentProps> = {
  args: {
    variant: 'error',
    ...TitleAndActionAndClose.args,
  },
};

export const Success: StoryObj<ToastComponentProps> = {
  args: {
    variant: 'success',
    ...TitleAndActionAndClose.args,
  },
};

export const Empty: StoryObj<ToastComponentProps> = {
  args: {
    children: null,
  },
};
