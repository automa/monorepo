import React, { useMemo } from 'react';

import { getFragment } from 'gql';
import { Avatar, Tooltip } from 'shared';
import { getOrgAvatarUrl } from 'utils';

import { UserAvatarProps } from './types';

import { USER_AVATAR_FRAGMENT } from './UserAvatar.queries';

const UserAvatar: React.FC<UserAvatarProps> = ({ user: data, ...props }) => {
  const user = getFragment(USER_AVATAR_FRAGMENT, data);

  const avatarUrl = useMemo(() => {
    const { provider_type, provider_id } = user.providers[0];

    return getOrgAvatarUrl(provider_type, provider_id);
  }, [user]);

  return (
    <Tooltip body={user.name}>
      <Avatar {...props} src={avatarUrl} alt={user.name} />
    </Tooltip>
  );
};

export default UserAvatar;
