import { FastifyInstance } from 'fastify';

export type QueueDefinition<I> = {
  topic: string;
  handler?: (app: FastifyInstance, event: I) => Promise<void>;
};
