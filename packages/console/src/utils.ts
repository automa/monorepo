import { ProviderType } from '@automa/common';

import { environment } from 'env';

export const appName = (name: string = 'automa') =>
  `${name}${environment !== 'production' ? `-${environment}` : ''}`;

export const orgUri = (
  org: { provider_type: ProviderType; name: string },
  path = '',
) => `/${org.provider_type}/${org.name}${path}`;

export const getOrgAvatarUrl = (
  providerType: ProviderType,
  providerId: string,
) => {
  if (providerType === ProviderType.Github) {
    return `https://avatars.githubusercontent.com/u/${providerId}?size=32`;
  }

  return null;
};
