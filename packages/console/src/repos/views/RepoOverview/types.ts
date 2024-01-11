import { HTMLAttributes } from 'react';

import { RepoQuery } from 'gql/graphql';

export interface RepoOverviewProps extends HTMLAttributes<HTMLDivElement> {
  repo: NonNullable<RepoQuery['repo']>;
}
