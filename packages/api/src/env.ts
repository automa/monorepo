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
    default: 'thisismycoupdetathandsupupgethigh',
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
    CLIENT_ID: Type.String({
      default: 'Iv1.bee7999253d03200',
    }),
    CLIENT_SECRET: Type.String({
      default: '279f43a10c306d492656f8069e8b052dc5ccf7d0',
    }),
    ID: Type.String({
      default: '378160',
    }),
    PEM: Type.String({
      default:
        '-----BEGIN RSA PRIVATE KEY-----\nMIIEpQIBAAKCAQEAp6YHDgvCF20nEvR547atYDOmrrfF+bLhmM5Uzr8KT4RibpmX\naiJHd73pIMeKDJJhhVWETaIY7xnkQZEivrIZDC6tHVFaJxfihZ8d8RNFqNVNQn21\nQlH86o1sDeKLm49vBQYmLFYUiIVHCzGEmIXo+TK7hwlPMN7ORHbr/EtoA8n94cwA\nmDVbp0ZdQc452cUTugVGe8CbLfc4w6Kl2CnCv8SK4A7X08LvfXsa8NnI49nbGQHe\nvXUmqvuAnWgS1n+GI+kbeZWRJO7khb27NFZJYchndR9o79yVqA/67LaYYbHDWFOY\n26ZSsAEXC2ejUZTcsyEgtCGk33iCJTmjE95dJwIDAQABAoIBAEybTl/5uYAw7Yj4\n0/XdFM5/66us6DdYqUPFDPXIUDLTwJLfdlQWQ+gQjMXgyFFEVnGyCRncd15Sy322\nj1TqVw29Cnf6I6L3hBghBHKTpuImTf6TKM+cXWDkrLqPidHUshtumuTplMppdHRF\n9Vwo3LN6njxvYZNoTIL2gJEx9966oZK+T7s0Am9JbAenqzApC8zI3NKVqPVGsHci\nfD1WMAW8G1VJaLjU6tCCMfPseAJ4sZdtDGI5N+h1uYzS8A6ZVwKq1r9gVQPR5a/s\nev5YrA2S/ANeivQiY0Y7Z2kAFrNpcdJGgk1+RUyrdlAkypaa9eKm1yTabzU3jGM4\nPuwhlWkCgYEA3gA+Y9yXOD7vzXmlBGXHI13xUrFC/xzzT0ypUWLf7DY5VC+AfCPz\n/6MJIlIhmKhHUVypSaBfrA8xqpQ6IfnKheLTUiIBF79qgVQsLOKQ40eVpZ8v4su+\nWvtvyfz6WEs/epeo2J3r4XuE+FVaATl0n9RhKsB/odqQBoyI+GkPdzMCgYEAwVLY\nuSkbufoomBCNPEJVA3vl6e5JkhdK+AHTnGugAwHElOPbgfkfcMkkoSjxr425tNgu\nzKIkyb6But0+sDJ6iHTWr9t9fh9eksr4BKgqGJMQdLELXQ0wMcu16nFO6xyo7q4d\nM3T40Dis9RM4xVg3qALPOuFeUyNZ6CV+mOZ9Mj0CgYEAhd+9v/jJlFiXweBGe+Vo\ndlJzcbuFvFRYAY0oWfT3NfnpDnRq1fHUdWd63aCLtARepZjsWYMFzruG5ufmOpDo\n6V5EszXgVNLQxlbdIOAsIXMMskjR1sGo9DLGUhdlXJNcH3CPmLl7Aom7QQovcaeV\nRcEMK3zUOuWTju92td6dPfMCgYEApREuB3t4NyXH/38yeN9SY3Uo7MMPgnPtCTHW\nE1s59xdNWKvtw16JX+3/HrQtGO50QFvOKd/QdYn6jylV23Bee6D3ppRM5KG4SLKR\nbrh/qRf5FwoMX9lg60O7AoDZF5sTCykTudoIkRGzbFaLRMV8UDKF6wp/VZF7tOI+\n5CL5hykCgYEAycELMNpANTlzb2BvUyvQQcCr/kcAeh6hVNWKSg0040ktUYTZWWiE\nJM+5oQTHvCZwXqCeMrPWjwbwFp5yZMj5OZUVSjulgZ9fNrOuSrVnNsaX42OKNkA9\nDpV6wJ/s+mYG8x/vrLd6bWcBWxCrOxhdftwNks2f1XbT4OFY9VRCaCE=\n-----END RSA PRIVATE KEY-----',
    }),
    WEBHOOK_SECRET: Type.String({
      default: 'thisismygithubsecret',
    }),
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
    CLIENT_ID: Type.String({
      default: '896839d929f08c9c54d1fef96550fa9c',
    }),
    CLIENT_SECRET: Type.String({
      default: '439b86ac5f88f138985666467f59c04c',
    }),
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
  SEGMENT: Type.Object({
    ENABLED: Type.Boolean({
      default: isProduction,
    }),
    KEY: Type.String({
      default: 'DS0ZF0LeGPSHEXSYXwKCpiWqmUTasJtR',
    }),
  }),
  SENTRY_DSN: Type.String({
    default: '',
  }),
  STATSIG_KEY: Type.String({
    default: 'secret-fdn7OUPBxuy070vzfwvKKbx1G4dnwDJM7Gtir3mvxGI',
  }),
});

type Schema = Static<typeof schema>;

export const env = envSchema<Schema>({ schema });
