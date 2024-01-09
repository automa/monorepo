import { useQuery } from '@apollo/client';

import { Org } from '@automa/common';

import { GET_ORGS } from '../queries';

const useOrgs = () => {
  const { data, loading, error, refetch } = useQuery<{ orgs: Org[] }>(GET_ORGS);

  return {
    orgs: data?.orgs,
    loading,
    error,
    refetch,
  };
};

export default useOrgs;
