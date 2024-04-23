import { ProviderType } from '@automa/common';

export const getOrgAvatarUrl = (
  providerType: ProviderType,
  providerId: string,
) => {
  if (providerType === ProviderType.Github) {
    return `https://avatars.githubusercontent.com/u/${providerId}?size=32`;
  }

  return null;
};
