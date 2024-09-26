import { FastifyInstance } from 'fastify';

export type Context = {
  prisma: FastifyInstance['prisma'];
  events: FastifyInstance['events'];
};
