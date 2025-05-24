import { ProviderType } from 'gql/graphql';

import { Org } from 'orgs';

export const getRepoLink = (org: Org, repoName?: string) => {
  if (!repoName) return;

  if (org.provider_type === ProviderType.Github) {
    return `https://github.com/${org.name}/${repoName}`;
  }

  return;
};
