import { useQuery } from '@apollo/client';

import { Repo, ProviderType } from '@automa/common';

import { GET_REPO } from '../repo.queries';

const useRepo = (provider: ProviderType, orgName: string, name: string) => {
  const { data, loading, error, refetch } = useQuery<{ repo?: Repo }>(
    GET_REPO,
    {
      variables: {
        name,
        org_name: orgName,
        provider_type: provider,
      },
    },
  );

  return {
    repo: data?.repo,
    loading,
    error,
    refetch,
  };
};

export default useRepo;
