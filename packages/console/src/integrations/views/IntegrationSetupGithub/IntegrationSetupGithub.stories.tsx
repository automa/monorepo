import { Meta, StoryObj } from '@storybook/react';

import IntegrationSetupGithub from './IntegrationSetupGithub';

const meta = {
  title: 'IntegrationSetupGithub',
  component: IntegrationSetupGithub,
} satisfies Meta<typeof IntegrationSetupGithub>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
