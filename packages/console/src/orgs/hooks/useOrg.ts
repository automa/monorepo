import { useAppDispatch, useAppSelector } from 'store';

import { setOrg as set, selectOrg } from 'orgs/slices';

const useOrg = () => {
  const dispatch = useAppDispatch();

  const org = useAppSelector(selectOrg);

  const setOrg = (name: string) => {
    dispatch(set(name));
  };

  return {
    setOrg,
    org,
  };
};

export default useOrg;
