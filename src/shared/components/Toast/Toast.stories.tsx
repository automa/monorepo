import { Meta, StoryObj } from '@storybook/react';

import { Toast } from './Toast';

const meta = {
  title: 'Toast',
  component: Toast,
  args: {
    title: 'Title',
  },
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Description = {
  args: {
    description: 'Description',
  },
} satisfies Story;

export const Action = {
  args: {
    action: {
      altText: 'Action',
      cta: <div>Action</div>,
    },
  },
} satisfies Story;

export const Close = {
  args: {
    close: <div>X</div>,
  },
} satisfies Story;

export const DescriptionAndAction = {
  args: {
    ...Description.args,
    ...Action.args,
  },
} satisfies Story;

export const DescriptionAndClose = {
  args: {
    ...Description.args,
    ...Close.args,
  },
} satisfies Story;

export const ActionAndClose = {
  args: {
    ...Action.args,
    ...Close.args,
  },
} satisfies Story;

export const DescriptionAndActionAndClose = {
  args: {
    ...Description.args,
    ...Action.args,
    ...Close.args,
  },
} satisfies Story;

export const Error = {
  args: {
    variant: 'error',
    ...DescriptionAndActionAndClose.args,
  },
} satisfies Story;

export const Success = {
  args: {
    variant: 'success',
    ...DescriptionAndActionAndClose.args,
  },
} satisfies Story;
