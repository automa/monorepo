import { HTMLAttributes } from 'react';

import { FragmentType } from 'gql';

import { Org } from 'orgs';

import { REPO_FRAGMENT } from './Repo.queries';

export interface RepoProps extends HTMLAttributes<HTMLDivElement> {
  org: Org;
  repo: FragmentType<typeof REPO_FRAGMENT>;
}
