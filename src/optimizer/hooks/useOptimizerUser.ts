import { useCallback } from 'react';
import { useStatsigUser } from '@statsig/react-bindings';

import { User } from 'auth';

const useOptimizerUser = () => {
  const { user: optimizerUser, updateUserSync } = useStatsigUser();

  const updateOptimizerUser = useCallback(
    (user: User | null) => {
      updateUserSync({
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
    [updateUserSync, optimizerUser],
  );

  return { updateOptimizerUser };
};

export default useOptimizerUser;
