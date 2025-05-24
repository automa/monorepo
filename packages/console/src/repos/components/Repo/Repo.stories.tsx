import { Meta, StoryObj } from '@storybook/react';

import { makeFragmentData } from 'gql';
import { ProviderType, TaskState } from 'gql/graphql';

import Repo from './Repo';

import { REPO_FRAGMENT } from './Repo.queries';

const repo = {
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
};

const meta = {
  title: 'Repo',
  component: Repo,
  args: {
    org: {
      id: 1,
      name: 'org',
      provider_type: ProviderType.Github,
      provider_id: '1',
      provider_name: 'org',
      has_installation: true,
      bot_installations_count: 1,
    },
    repo: makeFragmentData(repo, REPO_FRAGMENT),
  },
} satisfies Meta<typeof Repo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Private = {
  args: {
    repo: makeFragmentData(
      {
        ...repo,
        is_private: true,
      },
      REPO_FRAGMENT,
    ),
  },
} satisfies Story;

export const Archived = {
  args: {
    repo: makeFragmentData(
      {
        ...repo,
        is_archived: true,
      },
      REPO_FRAGMENT,
    ),
  },
} satisfies Story;

export const WithoutInstallation = {
  args: {
    repo: makeFragmentData(
      {
        ...repo,
        has_installation: false,
      },
      REPO_FRAGMENT,
    ),
  },
} satisfies Story;

export const ArchivedWithoutInstallation = {
  args: {
    repo: makeFragmentData(
      {
        ...repo,
        is_archived: true,
        has_installation: false,
      },
      REPO_FRAGMENT,
    ),
  },
} satisfies Story;
