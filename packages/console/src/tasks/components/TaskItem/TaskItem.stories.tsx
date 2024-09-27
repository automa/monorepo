import { Meta, StoryObj } from '@storybook/react';
import { sub } from 'date-fns';

import {
  ProviderType,
  TaskActivityType,
  TaskItemType,
  TaskState,
} from '@automa/common';

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
          organizationUrlKey: 'demo',
          commentId: '123',
        },
      },
      TASK_ITEM_FRAGMENT,
    ),
  },
} satisfies Story;

export const OriginLinearUser = {
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
          organizationUrlKey: 'demo',
          userName: 'John Doe',
          userEmail: 'john@example.com',
          commentId: '123',
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

export const OriginJiraUser = {
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
          userName: 'John Doe',
          userEmail: 'john@example.com',
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
        data: {},
        bot: {
          id: 1,
          name: 'aider',
          image_url: 'https://aider.chat/assets/icons/apple-touch-icon.png',
          org: {
            id: 1,
            name: 'automa',
          },
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
        data: {},
        bot: {
          id: 1,
          name: 'aider',
          image_url: 'https://aider.chat/assets/icons/apple-touch-icon.png',
          org: {
            id: 1,
            name: 'automa',
          },
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
        data: {},
        actor_user,
        bot: {
          id: 1,
          name: 'aider',
          image_url: 'https://aider.chat/assets/icons/apple-touch-icon.png',
          org: {
            id: 1,
            name: 'automa',
          },
        },
      },
      TASK_ITEM_FRAGMENT,
    ),
  },
} satisfies Story;

export const BotIntegrationUser = {
  args: {
    taskItem: makeFragmentData(
      {
        id: 2,
        type: TaskItemType.Bot,
        created_at,
        data: {
          integration: 'linear',
          userName: 'John Doe',
          userEmail: 'john@example.com',
        },
        bot: {
          id: 1,
          name: 'aider',
          image_url: 'https://aider.chat/assets/icons/apple-touch-icon.png',
          org: {
            id: 1,
            name: 'automa',
          },
        },
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
        data: {},
        repo: {
          id: 1,
          name: 'monorepo',
          org: {
            id: 1,
            provider_type: ProviderType.Github,
            provider_name: 'automa',
          },
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
        data: {},
        repo: {
          id: 1,
          name: 'monorepo',
          org: {
            id: 1,
            provider_type: ProviderType.Github,
            provider_name: 'automa',
          },
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
        data: {},
        actor_user,
        repo: {
          id: 1,
          name: 'monorepo',
          org: {
            id: 1,
            provider_type: ProviderType.Github,
            provider_name: 'automa',
          },
        },
      },
      TASK_ITEM_FRAGMENT,
    ),
  },
} satisfies Story;

export const RepoIntegrationUser = {
  args: {
    taskItem: makeFragmentData(
      {
        id: 2,
        type: TaskItemType.Repo,
        created_at,
        data: {
          integration: 'linear',
          userName: 'John Doe',
          userEmail: 'john@example.com',
        },
        repo: {
          id: 1,
          name: 'monorepo',
          org: {
            id: 1,
            provider_type: ProviderType.Github,
            provider_name: 'automa',
          },
        },
      },
      TASK_ITEM_FRAGMENT,
    ),
  },
} satisfies Story;

export const ProposalGithub = {
  args: {
    taskItem: makeFragmentData(
      {
        id: 2,
        type: TaskItemType.Proposal,
        created_at,
        data: {
          prNumber: 123,
          prTitle: 'Demo PR',
          prState: 'open',
          prMerged: false,
        },
        repo: {
          id: 1,
          name: 'monorepo',
          org: {
            id: 1,
            provider_type: ProviderType.Github,
            provider_name: 'automa',
          },
        },
        bot: {
          id: 1,
          name: 'aider',
          image_url: 'https://aider.chat/assets/icons/apple-touch-icon.png',
          org: {
            id: 1,
            name: 'automa',
          },
        },
      },
      TASK_ITEM_FRAGMENT,
    ),
  },
} satisfies Story;

export const ActivityState = {
  args: {
    taskItem: makeFragmentData(
      {
        id: 2,
        type: TaskItemType.Activity,
        created_at,
        data: {},
        activity: {
          id: 1,
          type: TaskActivityType.State,
          from_state: TaskState.Submitted,
          to_state: TaskState.Completed,
        },
      },
      TASK_ITEM_FRAGMENT,
    ),
  },
} satisfies Story;

export const ActivityStateAuthor = {
  args: {
    taskItem: makeFragmentData(
      {
        id: 2,
        type: TaskItemType.Activity,
        created_at,
        data: {},
        actor_user,
        activity: {
          id: 1,
          type: TaskActivityType.State,
          from_state: TaskState.Submitted,
          to_state: TaskState.Completed,
        },
      },
      TASK_ITEM_FRAGMENT,
    ),
  },
} satisfies Story;

export const ActivityStateBot = {
  args: {
    taskItem: makeFragmentData(
      {
        id: 2,
        type: TaskItemType.Activity,
        created_at,
        data: {},
        bot: {
          id: 1,
          name: 'aider',
          image_url: 'https://aider.chat/assets/icons/apple-touch-icon.png',
          org: {
            id: 1,
            name: 'automa',
          },
        },
        activity: {
          id: 1,
          type: TaskActivityType.State,
          from_state: TaskState.Submitted,
          to_state: TaskState.Completed,
        },
      },
      TASK_ITEM_FRAGMENT,
    ),
  },
} satisfies Story;

export const ActivityStateIntegrationUser = {
  args: {
    taskItem: makeFragmentData(
      {
        id: 2,
        type: TaskItemType.Activity,
        created_at,
        data: {
          integration: 'github',
          userId: 2,
          userName: 'John Doe',
        },
        activity: {
          id: 1,
          type: TaskActivityType.State,
          from_state: TaskState.Submitted,
          to_state: TaskState.Completed,
        },
      },
      TASK_ITEM_FRAGMENT,
    ),
  },
} satisfies Story;
