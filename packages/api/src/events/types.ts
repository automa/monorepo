import { FastifyInstance } from 'fastify';
import { RepeatOptions } from 'bullmq';

export type JobDefinition<I> = {
  repeat?: RepeatOptions;
  handler?: (app: FastifyInstance, event: I) => Promise<void>;
};
