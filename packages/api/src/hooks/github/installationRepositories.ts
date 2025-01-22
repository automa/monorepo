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
  const update = {
    provider_name: installation.account.login,
    has_installation: true,
    github_installation_id: installation.id,
    is_user: installation.account.type === 'User',
  };

  const org = await app.prisma.orgs.upsert({
    where: {
      provider_type_provider_id: {
        provider_type: provider.github,
        provider_id: `${installation.account.id}`,
      },
    },
    update,
    create: {
      name: installation.account.login,
      provider_type: provider.github,
      provider_id: `${installation.account.id}`,
      ...update,
    },
  });

  await app.events.syncGithubOrgUsers.publish(org.id, {
    orgId: org.id,
  });

  return org;
};

export const addRepo = async (
  app: FastifyInstance,
  axios: AxiosInstance,
  org: orgs,
  repository: GithubRepositoryMinimal,
  cause: CauseType,
) => {
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

  await app.events.syncGithubRepoUsers.publish(repo.id, {
    repoId: repo.id,
  });

  // No need to wait for this to finish
  syncSettings(app, axios, repo, repository, cause);

  return repo;
};

export default {
  added,
  removed,
};
