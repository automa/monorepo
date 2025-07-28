import React from 'react';
import { Link } from 'react-router-dom';

import { getFragment } from 'gql';
import DropdownMenu, {
  DropdownMenuItem,
  DropdownMenuLabel,
} from 'shared/components/DropdownMenu';

import UserAvatar from '../UserAvatar';

import { UserNavbarProps } from './types';

import { USER_QUERY_FRAGMENT } from './UserNavbar.queries';
import { Container } from './UserNavbar.styles';

const UserNavbar: React.FC<UserNavbarProps> = ({
  data: fullData,
  ...props
}) => {
  const data = getFragment(USER_QUERY_FRAGMENT, fullData);

  if (!data.user) {
    return null;
  }

  return (
    <Container {...props} asChild>
      <DropdownMenu
        align="end"
        trigger={<UserAvatar user={data.user} size="large" />}
      >
        <DropdownMenuLabel>{data.user.email}</DropdownMenuLabel>
        <Link to="account">
          <DropdownMenuItem>Preferences</DropdownMenuItem>
        </Link>
        <Link to="auth/logout">
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </Link>
      </DropdownMenu>
    </Container>
  );
};

export default UserNavbar;
