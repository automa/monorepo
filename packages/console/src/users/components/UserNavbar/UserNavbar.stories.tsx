import { Meta, StoryObj } from '@storybook/react';

import { makeFragmentData } from 'gql';
import { ProviderType } from 'gql/graphql';

import { USER_AVATAR_FRAGMENT } from '../UserAvatar';

import UserNavbar from './UserNavbar';

import { USER_QUERY_FRAGMENT } from './UserNavbar.queries';

const meta = {
  title: 'UserNavbar',
  component: UserNavbar,
  args: {
    data: makeFragmentData(
      {
        user: {
          email: 'pavan.sss1991@gmail.com',
          ...makeFragmentData(
            {
              id: 1,
              name: 'Pavan Kumar Sunkara',
              providers: [
                {
                  id: 1,
                  provider_type: ProviderType.Github,
                  provider_id: '174703',
                },
              ],
            },
            USER_AVATAR_FRAGMENT,
          ),
        },
      },
      USER_QUERY_FRAGMENT,
    ),
  },
} satisfies Meta<typeof UserNavbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
