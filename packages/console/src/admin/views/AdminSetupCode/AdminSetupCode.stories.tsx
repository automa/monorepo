import { Meta, StoryObj } from '@storybook/react';

import AdminSetupCode from './AdminSetupCode';

const meta = {
  title: 'AdminSetupCode',
  component: AdminSetupCode,
  parameters: {
    state: {
      app: {
        app: {
          cloud: true,
          client_uri: 'http://localhost:3000',
          webhook_uri: 'http://test.ngrok.io',
          integrations: {
            github: false,
            gitlab: false,
            linear: false,
            jira: false,
            slack: false,
          },
        },
      },
    },
  },
} satisfies Meta<typeof AdminSetupCode>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
