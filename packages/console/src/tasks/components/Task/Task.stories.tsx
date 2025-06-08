import { Meta, StoryObj } from '@storybook/react';

import { makeFragmentData } from 'gql';
import { ProviderType, TaskItemType, TaskState } from 'gql/graphql';

import { USER_AVATAR_FRAGMENT } from 'users/components';

import { TASK_ITEM_FRAGMENT } from '../TaskItem';

import Task from './Task';

import { TASK_FRAGMENT } from './Task.queries';

import TaskItemBadgeStory, {
  Bot,
  ProposalGithubOpen,
  RepoGithub,
} from '../TaskItemBadge/TaskItemBadge.stories';

const task = {
  id: 1,
  title: 'Task 1',
  is_scheduled: false,
  created_at: '2024-05-15T09:04:04.629Z',
  state: TaskState.Started,
  items: [],
};

const actor_user = makeFragmentData(
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
);

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
        state: TaskState.Completed,
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
          {
            type: TaskItemType.Origin,
            ...makeFragmentData(
              {
                id: 1,
                type: TaskItemType.Origin,
                created_at: '2024-05-15T09:04:04.629Z',
                data: {},
                actor_user,
              },
              TASK_ITEM_FRAGMENT,
            ),
          },
        ],
      },
      TASK_FRAGMENT,
    ),
  },
} satisfies Story;

export const OriginIntegration = {
  args: {
    task: makeFragmentData(
      {
        ...task,
        items: [
          {
            type: TaskItemType.Origin,
            ...makeFragmentData(
              TaskItemBadgeStory.args.taskItem,
              TASK_ITEM_FRAGMENT,
            ),
          },
        ],
      },
      TASK_FRAGMENT,
    ),
  },
} satisfies Story;

export const OriginIntegrationUser = {
  args: {
    task: makeFragmentData(
      {
        ...task,
        items: [
          {
            type: TaskItemType.Origin,
            ...makeFragmentData(
              {
                ...TaskItemBadgeStory.args.taskItem,
                data: {
                  ...TaskItemBadgeStory.args.taskItem.data,
                  userName: 'John Doe',
                  userEmail: 'john@example.com',
                },
              },
              TASK_ITEM_FRAGMENT,
            ),
          },
        ],
      },
      TASK_FRAGMENT,
    ),
  },
} satisfies Story;

export const OriginIntegrationUserAuthor = {
  args: {
    task: makeFragmentData(
      {
        ...task,
        items: [
          {
            type: TaskItemType.Origin,
            ...makeFragmentData(
              {
                ...TaskItemBadgeStory.args.taskItem,
                data: {
                  ...TaskItemBadgeStory.args.taskItem.data,
                  userName: 'John Doe',
                  userEmail: 'john@example.com',
                },
                actor_user,
              },
              TASK_ITEM_FRAGMENT,
            ),
          },
        ],
      },
      TASK_FRAGMENT,
    ),
  },
} satisfies Story;

export const Badges = {
  args: {
    task: makeFragmentData(
      {
        ...task,
        items: [
          {
            type: TaskItemType.Origin,
            ...makeFragmentData(
              TaskItemBadgeStory.args.taskItem,
              TASK_ITEM_FRAGMENT,
            ),
          },
          {
            type: TaskItemType.Repo,
            ...makeFragmentData(RepoGithub.args.taskItem, TASK_ITEM_FRAGMENT),
          },
          {
            type: TaskItemType.Bot,
            ...makeFragmentData(Bot.args.taskItem, TASK_ITEM_FRAGMENT),
          },
          {
            type: TaskItemType.Proposal,
            ...makeFragmentData(
              ProposalGithubOpen.args.taskItem,
              TASK_ITEM_FRAGMENT,
            ),
          },
        ],
      },
      TASK_FRAGMENT,
    ),
  },
} satisfies Story;

export const FilteredOnBot = {
  args: {
    ...Badges.args,
    filteredOn: [TaskItemType.Bot],
  },
} satisfies Story;

export const FilteredOnRepo = {
  args: {
    ...Badges.args,
    filteredOn: [TaskItemType.Repo],
  },
} satisfies Story;
