import { FastifyInstance } from 'fastify';

import { orgs } from '@automa/prisma';

import { GithubEventActionHandler } from './types';

const added: GithubEventActionHandler = async (app, body) => {
  const org = await app.prisma.orgs.findFirst({
    where: {
      provider_type: 'github',
      provider_id: `${body.installation.account.id}`,
    },
  });

  if (!org) {
    return;
  }

  for (const repository of body.repositories_added) {
    await addRepo(app, org, repository);
  }
};

const removed: GithubEventActionHandler = async (app, body) => {
  const org = await app.prisma.orgs.findFirst({
    where: {
      provider_type: 'github',
      provider_id: `${body.installation.account.id}`,
    },
  });

  if (!org) {
    return;
  }

  await app.prisma.repos.updateMany({
    where: {
      org_id: org.id,
      provider_id: {
        in: body.repositories_removed.map((repo: any) => `${repo.id}`),
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
  repository: any,
) => {
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
      has_installation: true,
    },
    create: {
      org_id: org.id,
      provider_id: `${repository.id}`,
      name: repository.name,
      is_private: repository.private,
      has_installation: true,
    },
  });
};

export default {
  added,
  removed,
};
