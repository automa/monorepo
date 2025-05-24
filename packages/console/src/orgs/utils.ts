import { ProviderType } from 'gql/graphql';
import { appName } from 'utils';

import { Org } from './types';

export const getOrgSettingsLink = (org: Org) => {
  if (org.provider_type === ProviderType.Github) {
    return `https://github.com/organizations/${org.provider_name}/settings/installations/${org.github_installation_id}`;
  }

  return;
};

export const getOrgInstallLink = (org: Org) => {
  if (org.provider_type === ProviderType.Github) {
    return `https://github.com/apps/${appName()}/installations/new/permissions?target_id=${
      org.provider_id
    }`;
  }

  return;
};
