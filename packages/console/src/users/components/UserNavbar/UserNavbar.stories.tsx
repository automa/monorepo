import { Meta, StoryObj } from '@storybook/react';

import { ProviderType } from '@automa/common';

import { makeFragmentData } from 'gql';

import UserNavbar from './UserNavbar';
import { ME_QUERY_FRAGMENT } from './UserNavbar.queries';

const meta = {
  title: 'UserNavbar',
  component: UserNavbar,
  args: {
    data: makeFragmentData(
      {
        me: {
          id: 1,
          name: 'Pavan Kumar Sunkara',
          email: 'pavan.sss1991@gmail.com',
          providers: [
            {
              id: 1,
              provider_type: ProviderType.Github,
              provider_id: '174703',
            },
          ],
        },
      },
      ME_QUERY_FRAGMENT,
    ),
  },
  argTypes: {},
} satisfies Meta<typeof UserNavbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
