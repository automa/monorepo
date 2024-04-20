import { ProviderType } from '@automa/common';

import { useAppDispatch, useAppSelector } from 'store';

import { setOrg as set, selectOrg } from 'orgs/slices';

const useOrg = () => {
  const dispatch = useAppDispatch();

  const org = useAppSelector(selectOrg);

  const setOrg = (provider: ProviderType, name: string) => {
    dispatch(set({ provider, name }));
  };

  return {
    setOrg,
    org,
  };
};

export default useOrg;
