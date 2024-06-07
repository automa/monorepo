import { BaseContext } from '@apollo/server';
import { PrismaClient, users } from '@automa/prisma';
import { FastifyInstance } from 'fastify';

export interface Context extends BaseContext {
  userId: users['id'];
  prisma: PrismaClient;
  analytics: FastifyInstance['analytics'];
  optimizer: FastifyInstance['optimizer'];
}
