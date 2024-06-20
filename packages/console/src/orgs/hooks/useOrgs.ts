import { useAppDispatch, useAppSelector } from 'store';

import {
  selectOrgs,
  selectOrgsLoading,
  setOrgs as set,
  setOrgsLoading as setLoading,
  unsetOrgs as unset,
} from 'orgs/slices';
import { Org } from 'orgs/types';

const useOrgs = () => {
  const dispatch = useAppDispatch();

  const orgs = useAppSelector(selectOrgs);
  const orgsLoading = useAppSelector(selectOrgsLoading);

  const setOrgs = (orgs: Org[]) => {
    dispatch(set(orgs));
  };

  const unsetOrgs = () => {
    dispatch(unset());
  };

  const setOrgsLoading = (loading: boolean) => {
    dispatch(setLoading(loading));
  };

  return {
    setOrgs,
    unsetOrgs,
    setOrgsLoading,
    orgs,
    orgsLoading,
  };
};

export default useOrgs;
