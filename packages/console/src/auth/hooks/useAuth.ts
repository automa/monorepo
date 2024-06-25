import { useAppDispatch, useAppSelector } from 'store';

import {
  selectAuthLoading,
  setAuth as set,
  setAuthLoading as setLoading,
  setUserOrg as setOrg,
  unsetAuth as unset,
} from 'auth/slices';
import { User } from 'auth/types';

const useAuth = () => {
  const dispatch = useAppDispatch();

  const authLoading = useAppSelector(selectAuthLoading);

  const setUserOrg = (id: number) => {
    dispatch(setOrg(`${id}`));
  };

  const setAuth = (user: User) => {
    dispatch(set(user));
  };

  const unsetAuth = () => {
    dispatch(unset());
  };

  const setAuthLoading = (loading: boolean) => {
    dispatch(setLoading(loading));
  };

  return {
    setUserOrg,
    setAuth,
    unsetAuth,
    setAuthLoading,
    authLoading,
  };
};

export default useAuth;
