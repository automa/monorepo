import { useAppDispatch } from 'store';

import {
  setAuth as set,
  setUserOrg as setOrg,
  unsetAuth as unset,
} from 'auth/slices';
import { User } from 'auth/types';

const useAuth = () => {
  const dispatch = useAppDispatch();

  const setUserOrg = (id: number) => {
    dispatch(setOrg(`${id}`));
  };

  const setAuth = (user: User) => {
    dispatch(set(user));
  };

  const unsetAuth = () => {
    dispatch(unset());
  };

  return {
    setUserOrg,
    setAuth,
    unsetAuth,
  };
};

export default useAuth;
