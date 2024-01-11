import { Meta, StoryObj } from '@storybook/react';

import { makeFragmentData } from 'gql';

import UserNavbar from './UserNavbar';
import { ME_QUERY_FRAGMENT } from './UserNavbar.queries';
import { UserNavbarProps } from './types';

export default {
  title: 'UserNavbar',
  component: UserNavbar,
  argTypes: {},
} as Meta<UserNavbarProps>;

export const Default: StoryObj<UserNavbarProps> = {
  args: {
    data: makeFragmentData(
      {
        me: {
          id: 1,
          name: 'Pavan Kumar Sunkara',
          email: 'pavan.sss1991@gmail.com',
        },
      },
      ME_QUERY_FRAGMENT,
    ),
  },
};
