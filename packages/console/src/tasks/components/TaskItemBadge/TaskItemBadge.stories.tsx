import { Meta, StoryObj } from '@storybook/react';

import { IntegrationType, ProviderType, TaskItemType } from 'gql/graphql';

import TaskItemBadge from './TaskItemBadge';

const meta = {
  title: 'TaskItemBadge',
  component: TaskItemBadge,
  args: {
    taskItem: {
      id: 1,
      created_at: '2024-05-15T09:04:04.629Z',
      type: TaskItemType.Origin,
      data: {
        integration: IntegrationType.Linear,
        issueIdentifier: 'DEMO-123',
        issueTitle: 'Demo Issue',
        organizationName: 'Demo Org',
        organizationUrlKey: 'demo',
        commentId: '123',
      },
    },
  },
} satisfies Meta<typeof TaskItemBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OriginLinear = {} satisfies Story;

export const OriginJira = {
  args: {
    taskItem: {
      ...meta.args.taskItem,
      type: TaskItemType.Origin,
      data: {
        integration: IntegrationType.Jira,
        issueKey: 'DEMO-123',
        issueTitle: 'Demo Issue',
        organizationName: 'Demo Org',
        organizationUrl: 'https://demo.atlassian.net',
        commentId: '123',
      },
    },
  },
} satisfies Story;

export const ProposalGithubOpen = {
  args: {
    taskItem: {
      ...meta.args.taskItem,
      type: TaskItemType.Proposal,
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
    },
  },
} satisfies Story;

export const ProposalGithubClosed = {
  args: {
    taskItem: {
      ...ProposalGithubOpen.args.taskItem,
      data: {
        ...ProposalGithubOpen.args.taskItem.data,
        prState: 'closed',
        prMerged: false,
      },
    },
  },
} satisfies Story;

export const ProposalGithubMerged = {
  args: {
    taskItem: {
      ...ProposalGithubOpen.args.taskItem,
      type: TaskItemType.Proposal,
      data: {
        ...ProposalGithubOpen.args.taskItem.data,
        prState: 'closed',
        prMerged: true,
      },
    },
  },
} satisfies Story;
