import { FragmentType } from 'gql';
import { AvatarComponentProps } from 'shared';

import { USER_AVATAR_FRAGMENT } from './UserAvatar.queries';

export interface UserAvatarProps
  extends Omit<AvatarComponentProps, 'src' | 'alt'> {
  user: FragmentType<typeof USER_AVATAR_FRAGMENT>;
}
