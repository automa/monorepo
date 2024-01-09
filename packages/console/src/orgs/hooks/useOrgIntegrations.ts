import { useQuery } from '@apollo/client';

import { Org, ProviderType } from '@automa/common';

import { GET_ORG_INTEGRATIONS } from '../queries';

const useOrgIntegrations = (provider: ProviderType, name: string) => {
  const { data, loading, error, refetch } = useQuery<{ org: Org }>(
    GET_ORG_INTEGRATIONS,
    {
      variables: {
        name,
        provider_type: provider,
      },
    },
  );

  return {
    org: data?.org,
    loading,
    error,
    refetch,
  };
};

export default useOrgIntegrations;
