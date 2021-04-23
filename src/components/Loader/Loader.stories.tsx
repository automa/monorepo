import React from 'react';
import { Story, Meta } from '@storybook/react';

import Loader, { LoaderProps } from './Loader';

export default {
  title: 'Loader',
  component: Loader,
  argTypes: {},
} as Meta;

const Template: Story<LoaderProps> = (args) => <Loader {...args} />;

export const Default = Template.bind({});

Default.args = {};
