import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import {
  Avatar,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
} from 'shared';
import { getFragment } from 'gql';
import { getOrgAvatarUrl } from 'utils';

import { UserNavbarProps } from './types';

import { ME_QUERY_FRAGMENT } from './UserNavbar.queries';
import { Container } from './UserNavbar.styles';

const UserNavbar: React.FC<UserNavbarProps> = ({
  data: fullData,
  ...props
}) => {
  const data = getFragment(ME_QUERY_FRAGMENT, fullData);

  const avatarUrl = useMemo(() => {
    const { provider_type, provider_id } = data.me.providers[0];

    return getOrgAvatarUrl(provider_type, provider_id);
  }, [data]);

  return (
    <Container {...props} asChild>
      <DropdownMenu
        align="end"
        trigger={<Avatar size="large" src={avatarUrl} alt={data.me.name} />}
      >
        <DropdownMenuLabel>{data.me.email}</DropdownMenuLabel>
        <Link to="/account">
          <DropdownMenuItem>Preferences</DropdownMenuItem>
        </Link>
        <Link to="/auth/logout">
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </Link>
      </DropdownMenu>
    </Container>
  );
};

export default UserNavbar;
