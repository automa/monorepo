import { FastifyInstance } from 'fastify';
import fasitfyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';

export default async function (app: FastifyInstance, environment: string) {
  app.register(fasitfyCookie);

  app.register(fastifySession, {
    secret: app.config.COOKIE_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: environment === 'production',
      sameSite: 'lax',
    },
  });
}

declare module 'fastify' {
  interface Session {
    userId: number;
  }
}
