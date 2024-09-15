import { Meta, StoryObj } from '@storybook/react';

import { IntegrationType } from '@automa/common';

import TaskItemBadge from './TaskItemBadge';

const meta = {
  title: 'TaskItemBadge',
  component: TaskItemBadge,
  args: {
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

export const Linear = {} satisfies Story;

export const Jira = {
  args: {
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
