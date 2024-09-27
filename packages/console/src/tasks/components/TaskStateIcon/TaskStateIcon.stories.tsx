import { Meta, StoryObj } from '@storybook/react';

import { TaskState } from '@automa/common';

import TaskStateIcon from './TaskStateIcon';

const meta = {
  title: 'TaskStateIcon',
  component: TaskStateIcon,
  args: {
    state: TaskState.Started,
  },
} satisfies Meta<typeof TaskStateIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Skipped = {
  args: {
    state: TaskState.Skipped,
  },
} satisfies Story;

export const Submitted = {
  args: {
    state: TaskState.Submitted,
  },
} satisfies Story;

export const Completed = {
  args: {
    state: TaskState.Completed,
  },
} satisfies Story;

export const Cancelled = {
  args: {
    state: TaskState.Cancelled,
  },
} satisfies Story;

export const Failed = {
  args: {
    state: TaskState.Failed,
  },
} satisfies Story;
