import { useAppSelector } from 'store';

import { selectUser } from 'auth/slices';

const useUser = () => {
  const user = useAppSelector(selectUser);

  return user;
};

export default useUser;
