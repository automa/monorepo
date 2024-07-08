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
