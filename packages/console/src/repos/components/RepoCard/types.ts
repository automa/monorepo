import { HTMLAttributes } from 'react';

import { FragmentType } from 'gql';

import { REPO_FRAGMENT } from './RepoCard.queries';

export interface RepoCardProps extends HTMLAttributes<HTMLDivElement> {
  repo: FragmentType<typeof REPO_FRAGMENT>;
}
