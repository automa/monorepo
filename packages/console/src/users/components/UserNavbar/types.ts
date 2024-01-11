import { HTMLAttributes } from 'react';

import { FragmentType } from 'gql';

import { ME_QUERY_FRAGMENT } from './UserNavbar.queries';

export interface UserNavbarProps extends HTMLAttributes<HTMLDivElement> {
  data: FragmentType<typeof ME_QUERY_FRAGMENT>;
}
