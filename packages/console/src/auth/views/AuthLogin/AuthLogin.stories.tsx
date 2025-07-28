import { Meta, StoryObj } from '@storybook/react';

import AuthLogin from './AuthLogin';

const meta = {
  title: 'AuthLogin',
  component: AuthLogin,
  parameters: {
    state: {
      app: {
        app: {
          cloud: true,
          client_uri: 'http://localhost:3000',
          webhook_uri: 'http://test.ngrok.io',
          integrations: {
            github: true,
            gitlab: false,
            linear: false,
            jira: false,
            slack: false,
          },
        },
      },
    },
  },
} satisfies Meta<typeof AuthLogin>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
