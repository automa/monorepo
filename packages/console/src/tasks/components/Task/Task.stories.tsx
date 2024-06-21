import { Meta, StoryObj } from '@storybook/react';

import { ProviderType } from '@automa/common';

import { makeFragmentData } from 'gql';

import Task from './Task';

import { TASK_FRAGMENT } from './Task.queries';

const meta = {
  title: 'Task',
  component: Task,
  args: {
    task: makeFragmentData(
      {
        id: 1,
        title: 'Task 1',
        created_at: '2024-05-15T09:04:04.629Z',
        author: {
          id: 1,
          name: 'Pavan Kumar Sunkara',
          email: 'pavan.sss1991@gmail.com',
          providers: [
            {
              id: 1,
              provider_type: ProviderType.Github,
              provider_id: '174703',
            },
          ],
        },
      },
      TASK_FRAGMENT,
    ),
  },
} satisfies Meta<typeof Task>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
