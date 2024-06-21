import { Meta, StoryObj } from '@storybook/react';

import { makeFragmentData } from 'gql';

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
      },
      REPO_FRAGMENT,
    ),
  },
} satisfies Meta<typeof Repo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
