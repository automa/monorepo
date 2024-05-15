import { RepoQuery } from 'gql/graphql';

export interface RepoOverviewProps {
  repo: NonNullable<RepoQuery['repo']>;
}
