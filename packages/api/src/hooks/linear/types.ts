import { FastifyInstance } from 'fastify';

export enum LinearEventType {
  Comment = 'Comment',
  OAuthApp = 'OAuthApp',
}

export type LinearEventActionHandler<T = any> = (
  app: FastifyInstance,
  payload: T,
) => Promise<void>;

export type LinearEventHandler = Record<string, LinearEventActionHandler>;
