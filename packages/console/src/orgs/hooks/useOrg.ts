import { useAppDispatch, useAppSelector } from 'store';

import {
  selectOrg,
  setOrg as set,
  setOrgBotInstallationsCount as setBotInstallationsCount,
} from 'orgs/slices';

const useOrg = () => {
  const dispatch = useAppDispatch();

  const org = useAppSelector(selectOrg);

  const setOrg = (name: string) => {
    dispatch(set(name));
  };

  const setOrgBotInstallationsCount = (name: string, count: number) => {
    dispatch(setBotInstallationsCount({ name, count }));
  };

  return {
    setOrg,
    setOrgBotInstallationsCount,
    org,
  };
};

export default useOrg;
