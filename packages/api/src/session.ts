import { FastifyInstance } from 'fastify';
import fasitfyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import redisStoreFactory from 'connect-redis';

import { env, isProduction } from './env';

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

declare module 'fastify' {
  interface Session {
    userId?: number;
    referer?: string;
    githubOauthState?: string;
    githubAccessToken?: string;
  }
}
