/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FastifyInstance } from 'fastify';
import fasitfyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import { Redis } from 'ioredis';
import redisStoreFactory from 'connect-redis';

export default async function (app: FastifyInstance, secure: boolean) {
  // @ts-ignore
  const RedisStore = redisStoreFactory(fastifySession);

  const store = new RedisStore({
    client: new Redis(app.config.REDIS_URL),
  });

  app.register(fasitfyCookie);

  // @ts-ignore
  app.register(fastifySession, {
    saveUninitialized: false,
    secret: app.config.COOKIE_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure,
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
