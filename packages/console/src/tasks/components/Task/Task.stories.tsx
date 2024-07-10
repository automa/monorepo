import { Meta, StoryObj } from '@storybook/react';

import { ProviderType, TaskItemType } from '@automa/common';

import { makeFragmentData } from 'gql';

import { USER_AVATAR_FRAGMENT } from 'users';

import { TASK_ITEM_FRAGMENT } from '../TaskItem';

import Task from './Task';

import { TASK_FRAGMENT } from './Task.queries';

const task = {
  id: 1,
  title: 'Task 1',
  created_at: '2024-05-15T09:04:04.629Z',
  completed_at: null,
  is_completed: false,
  items: [],
};

const meta = {
  title: 'Task',
  component: Task,
  args: {
    task: makeFragmentData(task, TASK_FRAGMENT),
  },
  parameters: {
    state: {
      orgs: {
        orgs: [
          {
            id: 1,
            name: 'org',
            provider_type: ProviderType.Github,
            provider_id: '1',
            provider_name: 'org',
            has_installation: true,
            bot_installations_count: 1,
          },
        ],
        org: {
          id: 1,
          name: 'org',
          provider_type: ProviderType.Github,
          provider_id: '1',
          provider_name: 'org',
          has_installation: true,
          bot_installations_count: 1,
        },
        loading: false,
      },
    },
  },
} satisfies Meta<typeof Task>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Completed = {
  args: {
    task: makeFragmentData(
      {
        ...task,
        completed_at: '2024-05-16T09:04:04.629Z',
        is_completed: true,
      },
      TASK_FRAGMENT,
    ),
  },
} satisfies Story;

export const OriginAuthor = {
  args: {
    task: makeFragmentData(
      {
        ...task,
        items: [
          makeFragmentData(
            {
              id: 1,
              type: TaskItemType.Origin,
              created_at: '2024-05-15T09:04:04.629Z',
              data: {},
              actor_user: makeFragmentData(
                {
                  id: 1,
                  name: 'Pavan Kumar Sunkara',
                  providers: [
                    {
                      id: 1,
                      provider_type: ProviderType.Github,
                      provider_id: '174703',
                    },
                  ],
                },
                USER_AVATAR_FRAGMENT,
              ),
            },
            TASK_ITEM_FRAGMENT,
          ),
        ],
      },
      TASK_FRAGMENT,
    ),
  },
} satisfies Story;
