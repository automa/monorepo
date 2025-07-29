import { Meta, StoryObj } from '@storybook/react';

import { IntegrationType, ProviderType } from 'gql/graphql';

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
      name: 'org',
    },
  },
} satisfies Story;

export const ConnectedUser = {
  args: {
    integration: IntegrationType.Jira,
    connected: true,
    config: {
      name: 'org',
      userEmail: 'user@org.com',
    },
  },
} satisfies Story;

export const Github = {
  args: {
    integration: IntegrationType.Github,
    connected: true,
  },
} satisfies Story;
