import { FastifyInstance } from 'fastify';
import { AxiosInstance } from 'axios';

import { CauseType } from '@automa/common';
import { orgs } from '@automa/prisma';

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
  const org = await app.prisma.orgs.findFirst({
    where: {
      provider_type: 'github',
      provider_id: `${body.installation.account.id}`,
      has_installation: true,
    },
  });

  if (!org) {
    return;
  }

  const { axios } = await caller(app, body.installation.id);

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
        provider_type: 'github',
        provider_id: `${body.installation.account.id}`,
      },
    },
    data: {
      has_installation: false,
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
