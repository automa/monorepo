import { Meta, StoryObj } from '@storybook/react';

import { makeFragmentData } from 'gql';
import { TaskState } from 'gql/graphql';

import Repo from './Repo';

import { REPO_FRAGMENT } from './Repo.queries';

const meta = {
  title: 'Repo',
  component: Repo,
  args: {
    repo: makeFragmentData(
      {
        id: 1,
        name: 'monorepo',
        is_archived: false,
        is_private: false,
        has_installation: true,
        tasks_count: [
          { count: 2, state: TaskState.Started },
          { count: 3, state: TaskState.Completed },
          { count: 1, state: TaskState.Submitted },
          { count: 2, state: TaskState.Skipped },
          { count: 1, state: TaskState.Failed },
          { count: 1, state: TaskState.Cancelled },
        ],
      },
      REPO_FRAGMENT,
    ),
  },
} satisfies Meta<typeof Repo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
