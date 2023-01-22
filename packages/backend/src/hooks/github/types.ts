import { FastifyInstance } from 'fastify';

export enum GithubEventType {
  GithubAppAuthorization = 'github_app_authorization',
  Installation = 'installation',
  InstallationRepositories = 'installation_repositories',
}

export type GithubEventActionHandler = (
  app: FastifyInstance,
  payload: any,
) => Promise<void>;

export type GithubEventHandler = Record<string, GithubEventActionHandler>;
