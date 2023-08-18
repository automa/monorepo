import { Meta, StoryObj } from '@storybook/react';

import OrgList from './OrgList';
import { OrgListProps } from './types';

export default {
  title: 'OrgList',
  component: OrgList,
  argTypes: {},
} as Meta<OrgListProps>;

export const Default: StoryObj<OrgListProps> = {
  args: {},
};
