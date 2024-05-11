import { useAppDispatch, useAppSelector } from 'store';

import {
  setOrgs as set,
  unsetOrgs as unset,
  setOrgsLoading as setLoading,
  selectOrgs,
  selectOrgsLoading,
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
