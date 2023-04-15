import { Meta, StoryObj } from '@storybook/react';

import RepoOverview from './RepoOverview';
import { RepoOverviewProps } from './types';

export default {
  title: 'RepoOverview',
  component: RepoOverview,
  args: {},
  argTypes: {},
} as Meta<RepoOverviewProps>;

export const Default: StoryObj<RepoOverviewProps> = {};
