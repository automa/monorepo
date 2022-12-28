import { join } from 'path';

import fastify from 'fastify';
import fastifySensible from '@fastify/sensible';
import fastifyEnv from '@fastify/env';
import fastifyCors from '@fastify/cors';
import fastifyAutoload from '@fastify/autoload';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import httpErrors from 'http-errors';

import { schema } from './env';
import logger from './logger';
import session from './session';

const envionment = process.env.NODE_ENV || 'development';

async function server() {
  const app = fastify({
    logger: logger[envionment as keyof typeof logger],
  });

  app.register(fastifySensible);
  await app.register(fastifyEnv, { schema });

  app.register(fastifyCors, {
    origin: app.config.CORS_ORIGIN,
  });

  await session(app, envionment);

  app.register(fastifyAutoload, {
    dir: join(__dirname, 'plugins'),
  });

  app.setErrorHandler((error, _, reply) => {
    if (error instanceof httpErrors.HttpError) {
      return error;
    }

    if (error.statusCode === 400) {
      return reply.unprocessableEntity(error.message);
    }

    for (const line of (error.stack ?? '').split('\n')) {
      console.error(line);
    }

    return reply.internalServerError();
  });

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Automa API',
        description: 'Automa API documentation',
        version: '0.1.0',
      },
      servers: [
        {
          url: 'http://localhost',
        },
      ],
    },
  });

  app.register(fastifySwaggerUi, {});

  app.register(fastifyAutoload, {
    dir: join(__dirname, 'routes'),
    routeParams: true,
  });

  try {
    await app.listen({
      port: parseInt(app.config.PORT, 10),
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

server();
