import { QueryResolvers } from '@automa/common';

import { env } from '../../env';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  app: () => {
    return {
      cloud: env.CLOUD,
      client_uri: env.CLIENT_URI,
      webhook_uri: env.WEBHOOK_URI ?? env.BASE_URI,
      integrations: {
        github:
          !!env.GITHUB_APP.CLIENT_ID &&
          !!env.GITHUB_APP.CLIENT_SECRET &&
          !!env.GITHUB_APP.PEM &&
          !!env.GITHUB_APP.WEBHOOK_SECRET,
        gitlab: false,
        linear:
          !!env.LINEAR_APP.CLIENT_ID &&
          !!env.LINEAR_APP.CLIENT_SECRET &&
          !!env.LINEAR_APP.WEBHOOK_SECRET,
        jira: !!env.JIRA_APP.CLIENT_ID && !!env.JIRA_APP.CLIENT_SECRET,
        slack: false,
      },
    };
  },
};
