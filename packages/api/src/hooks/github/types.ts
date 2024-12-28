import { FastifyInstance } from 'fastify';

export enum GithubEventType {
  GithubAppAuthorization = 'github_app_authorization',
  Installation = 'installation',
  InstallationRepositories = 'installation_repositories',
  Organization = 'organization',
  PullRequest = 'pull_request',
  Repository = 'repository',
}

export type GithubEventActionHandler<T = any> = (
  app: FastifyInstance,
  payload: T,
) => Promise<void>;

export type GithubEventHandler = Record<string, GithubEventActionHandler>;

export type GithubSender = {
  login: string;
  id: number;
};

export type GithubInstallationMinimal = {
  id: number;
};

export type GithubInstallation = GithubInstallationMinimal & {
  account: {
    login: string;
    id: number;
    type: 'User' | 'Organization';
  };
};

export type GithubRepositoryMinimal = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
};

export type GithubRepository = GithubRepositoryMinimal & {
  owner: {
    login: string;
    id: number;
    type: 'User' | 'Organization';
  };
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  default_branch: string;
};

export type GithubOrganization = {
  login: string;
  id: number;
};
