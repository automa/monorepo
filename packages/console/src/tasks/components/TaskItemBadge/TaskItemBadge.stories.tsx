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
    },
  },
} satisfies Meta<typeof TaskItemBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
