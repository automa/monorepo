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
      url: 'https://linear.app/demo/issue/DEMO-123',
    },
  },
} satisfies Meta<typeof TaskItemBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Linear = {} satisfies Story;
