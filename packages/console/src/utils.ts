import { environment } from 'env';

import { ProviderType } from 'gql/graphql';

export const appName = (name: string = 'automa') =>
  `${name}${environment === 'production' ? '' : `-${environment}`}`;

export const getOrgAvatarUrl = (
  providerType: ProviderType,
  providerId: string,
) => {
  if (providerType === ProviderType.Github) {
    return `https://avatars.githubusercontent.com/u/${providerId}?size=32`;
  }

  return null;
};

export const objectKeys = Object.keys as <T>(
  o: T,
) => Extract<keyof T, string>[];
