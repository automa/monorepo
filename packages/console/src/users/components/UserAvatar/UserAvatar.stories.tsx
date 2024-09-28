import { Meta, StoryObj } from '@storybook/react';

import { makeFragmentData } from 'gql';
import { ProviderType } from 'gql/graphql';

import UserAvatar from './UserAvatar';

import { USER_AVATAR_FRAGMENT } from './UserAvatar.queries';

const meta = {
  title: 'UserAvatar',
  component: UserAvatar,
  args: {
    user: makeFragmentData(
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
} satisfies Meta<typeof UserAvatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Small = {
  args: {
    size: 'small',
  },
} satisfies Story;

export const Large = {
  args: {
    size: 'large',
  },
} satisfies Story;
