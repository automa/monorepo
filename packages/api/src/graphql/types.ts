import { FastifyInstance } from 'fastify';
import { FastifySessionObject } from '@fastify/session';
import { BaseContext } from '@apollo/server';

import { users } from '@automa/prisma';

export interface Context extends BaseContext {
  userId: users['id'];
  session: FastifySessionObject;
  prisma: FastifyInstance['prisma'];
  events: FastifyInstance['events'];
  analytics: FastifyInstance['analytics'];
  optimizer: FastifyInstance['optimizer'];
}
