import { useCallback } from 'react';
import { useStatsigUser } from '@statsig/react-bindings';

import { User } from 'auth';

const useOptimizerUser = () => {
  const { user: optimizerUser, updateUserAsync } = useStatsigUser();

  const updateOptimizerUser = useCallback(
    (user: User | null) => {
      if (!user) return;

      updateUserAsync({
        userID: user?.id,
        email: user?.email,
        customIDs: {
          stableID: optimizerUser.customIDs?.stableID,
          ...(user && {
            orgID: user.org_id,
          }),
        },
      });
    },
    [updateUserAsync, optimizerUser],
  );

  return { updateOptimizerUser };
};

export default useOptimizerUser;
