import { HTMLAttributes } from 'react';

import { FragmentType } from 'gql';

import { REPO_FRAGMENT } from './Repo.queries';

export interface RepoProps extends HTMLAttributes<HTMLDivElement> {
  repo: FragmentType<typeof REPO_FRAGMENT>;
}
