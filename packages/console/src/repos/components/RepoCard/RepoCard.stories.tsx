import { Meta, StoryObj } from '@storybook/react';

import { makeFragmentData } from 'gql';

import RepoCard from './RepoCard';
import { REPO_FRAGMENT } from './RepoCard.queries';

const meta = {
  title: 'RepoCard',
  component: RepoCard,
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
  argTypes: {},
} satisfies Meta<typeof RepoCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
