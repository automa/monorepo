import { env } from './env';

import { FastifyInstance } from 'fastify';
import fasitfyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import redisStoreFactory from 'connect-redis';

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
      // Railway doesn't support secure cookies because of proxy routing
      secure: false,
      sameSite: 'lax',
    },
    store,
  });
}
