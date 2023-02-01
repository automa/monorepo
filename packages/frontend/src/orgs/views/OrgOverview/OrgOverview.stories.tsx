import { Meta, StoryObj } from '@storybook/react';

import OrgOverview from './OrgOverview';
import { OrgOverviewProps } from './types';

export default {
  title: 'OrgOverview',
  component: OrgOverview,
  args: {},
  argTypes: {},
} as Meta<OrgOverviewProps>;

export const Default: StoryObj<OrgOverviewProps> = {};
