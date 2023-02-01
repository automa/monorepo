import { useQuery } from '@apollo/client';

import { Org, ProviderType } from '@automa/common';

import { GET_ORG } from 'orgs/queries';

const useOrg = (provider: ProviderType, name: string) => {
  const { data, loading, error, refetch } = useQuery<{ org?: Org }>(GET_ORG, {
    variables: {
      name,
      provider_type: provider,
    },
  });

  return {
    org: data?.org,
    loading,
    error,
    refetch,
  };
};

export default useOrg;
