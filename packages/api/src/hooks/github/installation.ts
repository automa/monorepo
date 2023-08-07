import { FastifyInstance } from 'fastify';

import { caller } from '../../clients/github';

import { GithubEventActionHandler } from './types';
import { addRepo } from './installationRepositories';

const created: GithubEventActionHandler = async (app, body) => {
  const org = await app.prisma.orgs.upsert({
    where: {
      provider_type_provider_id: {
        provider_type: 'github',
        provider_id: `${body.installation.account.id}`,
      },
    },
    update: {
      has_installation: true,
      github_installation_id: body.installation.id,
    },
    create: {
      name: body.installation.account.login,
      provider_type: 'github',
      provider_id: `${body.installation.account.id}`,
      is_user: body.installation.account.type === 'User',
      has_installation: true,
      github_installation_id: body.installation.id,
    },
  });

  const { axios } = await caller(app, body.installation.id);

  for (const repository of body.repositories) {
    await addRepo(app, org, axios, repository);
  }
};

const deleted: GithubEventActionHandler = async (app, body) =>
  inactive(app, body.installation.account.id);

const suspend: GithubEventActionHandler = async (app, body) =>
  inactive(app, body.installation.account.id);

const unsuspend: GithubEventActionHandler = async (app, body) => {
  const org = await app.prisma.orgs.update({
    where: {
      provider_type_provider_id: {
        provider_type: 'github',
        provider_id: `${body.installation.account.id}`,
      },
    },
    data: {
      has_installation: true,
    },
  });

  const { paginate } = await caller(app, body.installation.id);

  const pages = paginate('/installation/repositories');

  for await (const data of pages) {
    for (const repository of data.repositories) {
      const update = {
        name: repository.name,
        is_private: repository.private,
        is_archived: repository.archived,
        has_installation: true,
      };

      await app.prisma.repos.upsert({
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
    }
  }
};

const inactive = async (app: FastifyInstance, providerId: number) => {
  await app.prisma.orgs.update({
    where: {
      provider_type_provider_id: {
        provider_type: 'github',
        provider_id: `${providerId}`,
      },
    },
    data: {
      has_installation: false,
    },
  });

  await app.prisma.repos.updateMany({
    where: {
      orgs: {
        provider_type: 'github',
        provider_id: `${providerId}`,
      },
    },
    data: {
      has_installation: false,
    },
  });
};

export default {
  created,
  deleted,
  suspend,
  unsuspend,
};
