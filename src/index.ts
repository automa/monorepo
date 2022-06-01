import fastify from 'fastify';
import fastifySensible from '@fastify/sensible';
import fastifyCors from '@fastify/cors';
import httpErrors from 'http-errors';

const app = fastify();

app.register(fastifySensible);
app.register(fastifyCors, {
  origin: process.env.CORS_ORIGIN,
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
