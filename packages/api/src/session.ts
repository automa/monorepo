import { FastifyInstance } from 'fastify';
import fasitfyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import redisStoreFactory from 'connect-redis';

import { env, isProduction } from './env';

declare module 'fastify' {
  interface Session {
    userId?: number;
    orgId?: number;
    referer?: string;
    githubAccessToken?: string;
    integrationOauthState?: string;
  }
}

export default async function (app: FastifyInstance) {
  // @ts-ignore
  const RedisStore = redisStoreFactory(fastifySession);

  const store = new RedisStore({
    client: app.redis,
  });

  app.register(fasitfyCookie);

  app.register(fastifySession, {
    saveUninitialized: false,
    secret: env.COOKIE_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: isProduction,
      sameSite: 'lax',
    },
    store,
  });
}
