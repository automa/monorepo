import { dirname, join } from 'node:path';

import envSchema from 'nested-env-schema';
import { z } from 'zod/v4';

import './telemetry';

// @ts-ignore
import pkg from '../package.json';

export const environment = process.env.NODE_ENV || 'development';

export const isTest = environment === 'test';
export const isProduction = !isTest && environment !== 'development';

export const product = 'automa';
export const service = 'api';
export const version = pkg.version;

const schema = z.object({
  BASE_URI: z.string().default('http://localhost:8080'),
  CLIENT_URI: z.string().default('http://localhost:3000'),
  COOKIE_SECRET: z.string().default('cookie_secret_for_development_purpose'),
  CLOUD: z.boolean().default(true),
  DATABASE_URL: z.string().default('postgresql://automa@localhost:5432/automa'),
  GCP: z.object({
    CREDENTIALS: z.string().default('{}'),
    PROJECT_ID: z.string().default('automa'),
  }),
  GITHUB_APP: z.object({
    ACCESS_TOKEN_URL: z
      .string()
      .default('https://github.com/login/oauth/access_token'),
    API_URI: z.string().default('https://api.github.com'),
    AUTHORIZE_URL: z
      .string()
      .default('https://github.com/login/oauth/authorize'),
    CALLBACK_URI: z.string().default('/callbacks/github'),
    SLUG: z
      .string()
      .default(
        `automa${environment === 'production' ? '' : `-${environment}`}`,
      ),
    CLIENT_ID: z.string().default(''),
    CLIENT_SECRET: z.string().default(''),
    PEM: z.string().default(''),
    WEBHOOK_SECRET: z.string().default(''),
  }),
  JIRA_APP: z.object({
    ACCESS_TOKEN_URL: z
      .string()
      .default('https://auth.atlassian.com/oauth/token'),
    ACCESSIBLE_RESOURCES_URL: z
      .string()
      .default('https://api.atlassian.com/oauth/token/accessible-resources'),
    API_URI: z.string().default('https://api.atlassian.com/ex/jira'),
    AUTHORIZE_URL: z.string().default('https://auth.atlassian.com/authorize'),
    CALLBACK_URI: z.string().default('/callbacks/jira'),
    CLIENT_ID: z.string().default(''),
    CLIENT_SECRET: z.string().default(''),
  }),
  LINEAR_APP: z.object({
    ACCESS_TOKEN_URL: z.string().default('https://api.linear.app/oauth/token'),
    API_URI: z.string().default('https://api.linear.app'),
    AUTHORIZE_URL: z.string().default('https://linear.app/oauth/authorize'),
    CALLBACK_URI: z.string().default('/callbacks/linear'),
    CLIENT_ID: z.string().default(''),
    CLIENT_SECRET: z.string().default(''),
    WEBHOOK_SECRET: z.string().default(''),
  }),
  PORT: z.number().default(8080),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  SEGMENT_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  STATSIG_KEY: z.string().optional(),
  WEBHOOK_URI: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

export const env = envSchema<Schema>({
  schema: z.toJSONSchema(schema),
  dotenv: {
    path: join(dirname(__dirname), isTest ? '.env.test' : '.env'),
  },
});
