import { dirname, join } from 'node:path';

import { Static, Type } from '@sinclair/typebox';
import envSchema from 'nested-env-schema';

// @ts-ignore
import pkg from '../package.json';

export const environment = process.env.NODE_ENV || 'development';

export const isTest = environment === 'test';
export const isProduction = !isTest && environment !== 'development';

export const product = 'automa';
export const service = 'api';
export const version = pkg.version;

const schema = Type.Object({
  BASE_URI: Type.String({
    default: 'http://localhost:8080',
  }),
  CLIENT_URI: Type.String({
    default: 'http://localhost:3000',
  }),
  COOKIE_SECRET: Type.String({
    default: 'cookie_secret_for_development_purpose',
  }),
  DATABASE_URL: Type.String({
    default: 'postgresql://automa@localhost:5432/automa',
  }),
  GCP: Type.Object({
    CREDENTIALS: Type.String({
      default: '{}',
    }),
    PROJECT_ID: Type.String({
      default: 'automa',
    }),
    PUBSUB_URL: Type.String({
      default: 'http://localhost:8681',
    }),
  }),
  GITHUB_APP: Type.Object({
    ACCESS_TOKEN_URL: Type.String({
      default: 'https://github.com/login/oauth/access_token',
    }),
    API_URI: Type.String({
      default: 'https://api.github.com',
    }),
    AUTHORIZE_URL: Type.String({
      default: 'https://github.com/login/oauth/authorize',
    }),
    CALLBACK_URI: Type.String({
      default: '/callbacks/github',
    }),
    CLIENT_ID: Type.String(),
    CLIENT_SECRET: Type.String(),
    PEM: Type.String(),
    WEBHOOK_SECRET: Type.String(),
  }),
  JIRA_APP: Type.Object({
    ACCESS_TOKEN_URL: Type.String({
      default: 'https://auth.atlassian.com/oauth/token',
    }),
    ACCESSIBLE_RESOURCES_URL: Type.String({
      default: 'https://api.atlassian.com/oauth/token/accessible-resources',
    }),
    API_URI: Type.String({
      default: 'https://api.atlassian.com/ex/jira',
    }),
    AUTHORIZE_URL: Type.String({
      default: 'https://auth.atlassian.com/authorize',
    }),
    CALLBACK_URI: Type.String({
      default: '/callbacks/jira',
    }),
    CLIENT_ID: Type.String(),
    CLIENT_SECRET: Type.String(),
  }),
  LINEAR_APP: Type.Object({
    ACCESS_TOKEN_URL: Type.String({
      default: 'https://api.linear.app/oauth/token',
    }),
    API_URI: Type.String({
      default: 'https://api.linear.app',
    }),
    AUTHORIZE_URL: Type.String({
      default: 'https://linear.app/oauth/authorize',
    }),
    CALLBACK_URI: Type.String({
      default: '/callbacks/linear',
    }),
    CLIENT_ID: Type.String(),
    CLIENT_SECRET: Type.String(),
    WEBHOOK_SECRET: Type.String(),
  }),
  OTEL: Type.Object({
    TRACES: Type.Object({
      SAMPLER_ARG: Type.Number({
        default: 1,
        maximum: 1,
        minimum: 0,
      }),
    }),
  }),
  PORT: Type.Number({
    default: 8080,
  }),
  REDIS_URL: Type.String({
    default: 'redis://localhost:6379',
  }),
  SEGMENT_KEY: Type.String({
    default: '',
  }),
  SENTRY_DSN: Type.String({
    default: '',
  }),
  STATSIG_KEY: Type.String({
    default: '',
  }),
});

type Schema = Static<typeof schema>;

export const env = envSchema<Schema>({
  schema,
  dotenv: {
    path: join(dirname(__dirname), '.env'),
  },
});
