import { FastifyInstance } from 'fastify';
import { AxiosInstance } from 'axios';

import { CauseType } from '@automa/common';
import { orgs, provider } from '@automa/prisma';

import { caller } from '../../clients/github';

import {
  GithubEventActionHandler,
  GithubInstallation,
  GithubRepository,
  GithubRepositoryMinimal,
} from './types';

import { syncSettings } from './settings';

const added: GithubEventActionHandler<{
  installation: GithubInstallation;
  repositories_added: GithubRepositoryMinimal[];
}> = async (app, body) => {
  const existingOrg = await app.prisma.orgs.findFirst({
    where: {
      provider_type: provider.github,
      provider_id: `${body.installation.account.id}`,
    },
  });

  // If the org is suspended, we don't want to add the repositories
  if (existingOrg && !existingOrg.has_installation) {
    return;
  }

  const org = await addOrg(app, body.installation);

  const { axios } = await caller(body.installation.id);

  for (const repository of body.repositories_added) {
    await addRepo(app, axios, org, repository, CauseType.REPOSITORY_ADDED);
  }
};

const removed: GithubEventActionHandler<{
  installation: GithubInstallation;
  repositories_removed: GithubRepositoryMinimal[];
}> = async (app, body) => {
  await app.prisma.repos.updateMany({
    where: {
      provider_id: {
        in: body.repositories_removed.map((repo) => `${repo.id}`),
      },
      orgs: {
        provider_type: provider.github,
        provider_id: `${body.installation.account.id}`,
      },
    },
    data: {
      has_installation: false,
    },
  });
};

export const addOrg = async (
  app: FastifyInstance,
  installation: GithubInstallation,
) => {
  // TODO: Sync users and orgs
  return app.prisma.orgs.upsert({
    where: {
      provider_type_provider_id: {
        provider_type: provider.github,
        provider_id: `${installation.account.id}`,
      },
    },
    update: {
      has_installation: true,
      github_installation_id: installation.id,
      // TODO: Add a test for an user being converted to an org when app is uninstalled and reinstalled
      is_user: installation.account.type === 'User',
    },
    create: {
      name: installation.account.login,
      provider_type: provider.github,
      provider_id: `${installation.account.id}`,
      provider_name: installation.account.login,
      has_installation: true,
      github_installation_id: installation.id,
    },
  });
};

export const addRepo = async (
  app: FastifyInstance,
  axios: AxiosInstance,
  org: orgs,
  repository: GithubRepositoryMinimal,
  cause: CauseType,
) => {
  // TODO: Sync users and repos
  const { data } = await axios.get(`/repos/${repository.full_name}`);

  return updateRepo(app, axios, org, data, cause);
};

export const updateRepo = async (
  app: FastifyInstance,
  axios: AxiosInstance,
  org: orgs,
  repository: GithubRepository,
  cause: CauseType,
) => {
  const update = {
    name: repository.name,
    is_private: repository.private,
    is_archived: repository.archived,
    has_installation: true,
  };

  const repo = await app.prisma.repos.upsert({
    where: {
      org_id_provider_id: {
        org_id: org.id,
        provider_id: `${repository.id}`,
      },
    },
    update,
    create: {
      org_id: org.id,
      provider_id: `${repository.id}`,
      ...update,
    },
  });

  return syncSettings(app, axios, repo, repository, cause);
};

export default {
  added,
  removed,
};
