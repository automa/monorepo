import { Meta, StoryObj } from '@storybook/react';

import { TaskItemType } from '@automa/common';

import TaskItem from './TaskItem';

const meta = {
  title: 'TaskItem',
  component: TaskItem,
  args: {
    taskItem: {
      id: 1,
      type: TaskItemType.Message,
      created_at: '2024-05-16T09:04:04.629Z',
      content: 'Hello, world!',
    },
  },
} satisfies Meta<typeof TaskItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
