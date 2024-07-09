import { FastifyInstance } from 'fastify';
import { BaseContext } from '@apollo/server';

import { users } from '@automa/prisma';

export interface Context extends BaseContext {
  userId: users['id'];
  prisma: FastifyInstance['prisma'];
  events: FastifyInstance['events'];
  analytics: FastifyInstance['analytics'];
  optimizer: FastifyInstance['optimizer'];
}
