import { BaseContext } from '@apollo/server';
import { PrismaClient, users } from '@automa/prisma';

export interface Context extends BaseContext {
  user: users;
  prisma: PrismaClient;
}
