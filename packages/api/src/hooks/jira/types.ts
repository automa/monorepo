import { FastifyInstance } from 'fastify';

export enum JiraEventType {
  CommentCreated = 'comment_created',
  CommentUpdated = 'comment_updated',
}

export type JiraEventHandler<T = any> = (
  app: FastifyInstance,
  payload: T,
) => Promise<void>;
