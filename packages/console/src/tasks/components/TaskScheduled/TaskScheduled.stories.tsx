import { Meta, StoryObj } from '@storybook/react';

import { ProviderType, TaskItemType } from '@automa/common';

import { makeFragmentData } from 'gql';

import { TASK_FRAGMENT } from '../Task';
import { TASK_ITEM_FRAGMENT } from '../TaskItem';

import TaskScheduled from './TaskScheduled';

const task = {
  id: 1,
  title: 'Task 1',
  is_scheduled: true,
  created_at: '2024-05-15T09:04:04.629Z',
  completed_at: null,
  is_completed: false,
  items: [
    makeFragmentData(
      {
        id: 1,
        type: TaskItemType.Repo,
        created_at: '2024-05-15T09:04:04.629Z',
        data: {
          repoId: 1,
          repoName: 'monorepo',
          repoOrgId: 1,
          repoOrgName: 'automa',
          repoOrgProviderType: 'github',
          repoOrgProviderId: '65730741',
          repoProviderId: '245484486',
        },
        actor_user: null,
      },
      TASK_ITEM_FRAGMENT,
    ),
    makeFragmentData(
      {
        id: 1,
        type: TaskItemType.Bot,
        created_at: '2024-05-15T09:04:04.629Z',
        data: {
          botId: 5,
          botName: 'github-runners',
          botImageUrl:
            'https://depot.dev/assets/brand/1693758816/depot-icon-on-light.svg',
          botOrgId: 1,
          botOrgName: 'automa',
        },
        actor_user: null,
      },
      TASK_ITEM_FRAGMENT,
    ),
  ],
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
