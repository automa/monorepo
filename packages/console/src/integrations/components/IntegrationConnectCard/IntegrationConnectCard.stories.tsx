import { Meta, StoryObj } from '@storybook/react';

import { IntegrationType, ProviderType } from '@automa/common';

import IntegrationConnectCard from './IntegrationConnectCard';

const meta = {
  title: 'IntegrationConnectCard',
  component: IntegrationConnectCard,
  args: {
    integration: IntegrationType.Linear,
    connected: false,
    config: null,
    org: {
      id: 1,
      name: 'org',
      provider_type: ProviderType.Github,
      provider_id: '1',
      provider_name: 'org',
      has_installation: true,
      bot_installations_count: 1,
    },
  },
} satisfies Meta<typeof IntegrationConnectCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Connected = {
  args: {
    connected: true,
    config: {
      slug: 'org',
    },
  },
} satisfies Story;

export const GitHub = {
  args: {
    integration: IntegrationType.Github,
    connected: true,
  },
} satisfies Story;
