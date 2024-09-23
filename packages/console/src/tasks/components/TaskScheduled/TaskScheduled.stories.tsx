import { Meta, StoryObj } from '@storybook/react';

import { ProviderType } from '@automa/common';

import { makeFragmentData } from 'gql';

import { TASK_FRAGMENT } from '../Task';
import { TASK_ITEM_FRAGMENT } from '../TaskItem';

import TaskScheduled from './TaskScheduled';

import { BotScheduled, RepoScheduled } from '../TaskItem/TaskItem.stories';
import { ProposalGithubOpen } from '../TaskItemBadge/TaskItemBadge.stories';

const task = {
  id: 1,
  title: 'Task 1',
  is_scheduled: true,
  created_at: '2024-05-15T09:04:04.629Z',
  completed_at: null,
  is_completed: false,
  items: [RepoScheduled.args.taskItem, BotScheduled.args.taskItem],
};

const meta = {
  title: 'TaskScheduled',
  component: TaskScheduled,
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
} satisfies Meta<typeof TaskScheduled>;

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

export const Proposal = {
  args: {
    task: makeFragmentData(
      {
        ...task,
        items: [
          ...task.items,
          makeFragmentData(
            {
              ...ProposalGithubOpen.args,
              id: 2,
              created_at: '2024-05-15T09:04:04.629Z',
            },
            TASK_ITEM_FRAGMENT,
          ),
        ],
      },
      TASK_FRAGMENT,
    ),
  },
} satisfies Story;
