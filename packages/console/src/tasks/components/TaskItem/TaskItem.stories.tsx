import { Meta, StoryObj } from '@storybook/react';
import { sub } from 'date-fns';

import { ProviderType, TaskItemType } from '@automa/common';

import { makeFragmentData } from 'gql';

import { USER_AVATAR_FRAGMENT } from 'users';

import TaskItem from './TaskItem';

import { TASK_ITEM_FRAGMENT } from './TaskItem.queries';

const created_at = sub(new Date(), { years: 1, days: 1 });

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
  title: 'TaskItem',
  component: TaskItem,
  args: {
    taskItem: makeFragmentData(
      {
        id: 1,
        type: TaskItemType.Message,
        created_at,
        data: { content: 'Hello, world!' },
        actor_user: null,
      },
      TASK_ITEM_FRAGMENT,
    ),
    scheduled: false,
  },
} satisfies Meta<typeof TaskItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Message = {} satisfies Story;

export const Origin = {
  args: {
    taskItem: makeFragmentData(
      {
        id: 2,
        type: TaskItemType.Origin,
        created_at,
        data: {
          orgId: 1,
        },
      },
      TASK_ITEM_FRAGMENT,
    ),
  },
} satisfies Story;

export const OriginAuthor = {
  args: {
    taskItem: makeFragmentData(
      {
        id: 2,
        type: TaskItemType.Origin,
        created_at,
        data: {
          orgId: 1,
        },
        actor_user,
      },
      TASK_ITEM_FRAGMENT,
    ),
  },
} satisfies Story;

export const OriginLinear = {
  args: {
    taskItem: makeFragmentData(
      {
        id: 2,
        type: TaskItemType.Origin,
        created_at,
        data: {
          integration: 'linear',
          issueIdentifier: 'DEMO-123',
          issueTitle: 'Demo Issue',
          organizationName: 'Demo Org',
          url: 'https://linear.app/demo/issue/DEMO-123',
        },
      },
      TASK_ITEM_FRAGMENT,
    ),
  },
} satisfies Story;

export const OriginJira = {
  args: {
    taskItem: makeFragmentData(
      {
        id: 2,
        type: TaskItemType.Origin,
        created_at,
        data: {
          integration: 'jira',
          issueKey: 'DEMO-123',
          issueTitle: 'Demo Issue',
          organizationName: 'Demo Org',
          organizationUrl: 'https://demo.atlassian.net',
          commentId: '123',
        },
      },
      TASK_ITEM_FRAGMENT,
    ),
  },
} satisfies Story;

export const Bot = {
  args: {
    taskItem: makeFragmentData(
      {
        id: 2,
        type: TaskItemType.Bot,
        created_at,
        data: {
          botId: 4,
          botName: 'aider',
          botImageUrl: 'https://aider.chat/assets/icons/apple-touch-icon.png',
          botOrgId: 1,
          botOrgName: 'automa',
        },
      },
      TASK_ITEM_FRAGMENT,
    ),
  },
} satisfies Story;

export const BotScheduled = {
  args: {
    taskItem: makeFragmentData(
      {
        id: 2,
        type: TaskItemType.Bot,
        created_at,
        data: {
          botId: 4,
          botName: 'aider',
          botImageUrl: 'https://aider.chat/assets/icons/apple-touch-icon.png',
          botOrgId: 1,
          botOrgName: 'automa',
        },
      },
      TASK_ITEM_FRAGMENT,
    ),
    scheduled: true,
  },
} satisfies Story;

export const BotAuthor = {
  args: {
    taskItem: makeFragmentData(
      {
        id: 2,
        type: TaskItemType.Bot,
        created_at,
        data: {
          botId: 4,
          botName: 'aider',
          botImageUrl: 'https://aider.chat/assets/icons/apple-touch-icon.png',
          botOrgId: 1,
          botOrgName: 'automa',
        },
        actor_user,
      },
      TASK_ITEM_FRAGMENT,
    ),
  },
} satisfies Story;

export const Repo = {
  args: {
    taskItem: makeFragmentData(
      {
        id: 2,
        type: TaskItemType.Repo,
        created_at,
        data: {
          repoId: 1,
          repoName: 'monorepo',
          repoOrgId: 1,
          repoOrgName: 'automa',
          repoOrgProviderType: 'github',
          repoOrgProviderId: '65730741',
          repoProviderId: '245484486',
        },
      },
      TASK_ITEM_FRAGMENT,
    ),
  },
} satisfies Story;

export const RepoScheduled = {
  args: {
    taskItem: makeFragmentData(
      {
        id: 2,
        type: TaskItemType.Repo,
        created_at,
        data: {
          repoId: 1,
          repoName: 'monorepo',
          repoOrgId: 1,
          repoOrgName: 'automa',
          repoOrgProviderType: 'github',
          repoOrgProviderId: '65730741',
          repoProviderId: '245484486',
        },
      },
      TASK_ITEM_FRAGMENT,
    ),
    scheduled: true,
  },
} satisfies Story;

export const RepoAuthor = {
  args: {
    taskItem: makeFragmentData(
      {
        id: 2,
        type: TaskItemType.Repo,
        created_at,
        data: {
          repoId: 1,
          repoName: 'monorepo',
          repoOrgId: 1,
          repoOrgName: 'automa',
          repoOrgProviderType: 'github',
          repoOrgProviderId: '65730741',
          repoProviderId: '245484486',
        },
        actor_user,
      },
      TASK_ITEM_FRAGMENT,
    ),
  },
} satisfies Story;
