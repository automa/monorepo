import { useAppDispatch, useAppSelector } from 'store';

import {
  selectAuthLoading,
  setAuth as set,
  setAuthLoading as setLoading,
  unsetAuth as unset,
} from 'auth/slices';
import { User } from 'auth/types';

const useAuth = () => {
  const dispatch = useAppDispatch();

  const authLoading = useAppSelector(selectAuthLoading);

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
    setAuth,
    unsetAuth,
    setAuthLoading,
    authLoading,
  };
};

export default useAuth;
