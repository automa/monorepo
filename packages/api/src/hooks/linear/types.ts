import { FastifyInstance } from 'fastify';

export enum LinearEventType {
  AgentSessionEvent = 'AgentSessionEvent',
  Comment = 'Comment',
  OAuthAuthorization = 'OAuthAuthorization',
}

export type LinearEventActionHandler<T = any> = (
  app: FastifyInstance,
  payload: T,
) => Promise<void>;

export type LinearEventHandler = Record<string, LinearEventActionHandler>;
