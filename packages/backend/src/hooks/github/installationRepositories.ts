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
      is_active: false,
    },
  });
};

export const addRepo = async (
  app: FastifyInstance,
  org: orgs,
  repository: any,
) => {
  const repo = await app.prisma.repos.findFirst({
    where: {
      org_id: org.id,
      provider_id: `${repository.id}`,
    },
  });

  if (!repo) {
    await app.prisma.repos.create({
      data: {
        org_id: org.id,
        name: repository.name,
        provider_id: `${repository.id}`,
        is_private: repository.private,
        is_active: true,
      },
    });
  } else {
    await app.prisma.repos.update({
      where: {
        id: repo.id,
      },
      data: {
        is_active: true,
        is_private: repository.private,
      },
    });
  }
};

export default {
  added,
  removed,
};
