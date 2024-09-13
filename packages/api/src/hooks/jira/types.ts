import { FastifyInstance } from 'fastify';

export enum JiraEventType {
  CommentCreated = 'comment_created',
}

export type JiraEventHandler<T = any> = (
  app: FastifyInstance,
  payload: T,
) => Promise<void>;
