import { HTMLAttributes } from 'react';

import { FragmentType } from 'gql';

import { USER_QUERY_FRAGMENT } from './UserNavbar.queries';

export interface UserNavbarProps extends HTMLAttributes<HTMLDivElement> {
  data: FragmentType<typeof USER_QUERY_FRAGMENT>;
}
