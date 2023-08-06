import { FastifyInstance } from 'fastify';
import { AxiosInstance } from 'axios';

import { orgs } from '@automa/prisma';

import { caller } from '../../clients/github';

import { GithubEventActionHandler } from './types';

const added: GithubEventActionHandler = async (app, body) => {
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
    await addRepo(app, org, axios, repository);
  }
};

const removed: GithubEventActionHandler = async (app, body) => {
  await app.prisma.repos.updateMany({
    where: {
      provider_id: {
        in: body.repositories_removed.map((repo: any) => `${repo.id}`),
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
  org: orgs,
  axios: AxiosInstance,
  repository: any,
) => {
  const { data } = await axios.get(`/repos/${repository.full_name}`);

  await app.prisma.repos.upsert({
    where: {
      org_id_provider_id: {
        org_id: org.id,
        provider_id: `${repository.id}`,
      },
    },
    update: {
      name: repository.name,
      is_private: repository.private,
      is_archived: data.archived,
      has_installation: true,
    },
    create: {
      org_id: org.id,
      provider_id: `${repository.id}`,
      name: repository.name,
      is_private: repository.private,
      is_archived: data.archived,
      has_installation: true,
    },
  });
};

export default {
  added,
  removed,
};
