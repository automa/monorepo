import { Meta, StoryObj } from '@storybook/react';

import { IntegrationType, ProviderType, TaskItemType } from '@automa/common';

import TaskItemBadge from './TaskItemBadge';

const meta = {
  title: 'TaskItemBadge',
  component: TaskItemBadge,
  args: {
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
} satisfies Meta<typeof TaskItemBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OriginLinear = {} satisfies Story;

export const OriginJira = {
  args: {
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
} satisfies Story;

export const ProposalGithubOpen = {
  args: {
    type: TaskItemType.Proposal,
    data: {
      repoName: 'monorepo',
      repoOrgProviderName: 'automa',
      repoOrgProviderType: ProviderType.Github,
      prId: 123,
      prTitle: 'Demo PR',
      prState: 'open',
      prMerged: false,
    },
  },
} satisfies Story;

export const ProposalGithubClosed = {
  args: {
    type: TaskItemType.Proposal,
    data: {
      ...ProposalGithubOpen.args.data,
      prState: 'closed',
      prMerged: false,
    },
  },
} satisfies Story;

export const ProposalGithubMerged = {
  args: {
    type: TaskItemType.Proposal,
    data: {
      ...ProposalGithubOpen.args.data,
      prState: 'closed',
      prMerged: true,
    },
  },
} satisfies Story;
