import React from 'react';

import { Flex } from 'shared';
import { getFragment } from 'gql';

import { UserNavbarProps } from './types';

import { ME_QUERY_FRAGMENT } from './UserNavbar.queries';
import { Container } from './UserNavbar.styles';

const UserNavbar: React.FC<UserNavbarProps> = ({
  data: fullData,
  ...props
}) => {
  const data = getFragment(ME_QUERY_FRAGMENT, fullData);

  return (
    <Container {...props}>
      <Flex direction="column" alignItems="center" className="gap-2">
        {data.me.name}
      </Flex>
    </Container>
  );
};

export default UserNavbar;
