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

const deleted: GithubEventActionHandler = async (app, body) => {
  const org = await app.prisma.orgs.findFirst({
    where: {
      provider_type: 'github',
      provider_id: `${body.installation.account.id}`,
    },
  });

  if (!org) {
    return;
  }

  await app.prisma.orgs.update({
    where: {
      id: org.id,
    },
    data: {
      has_installation: false,
    },
  });

  await app.prisma.repos.updateMany({
    where: {
      org_id: org.id,
    },
    data: {
      has_installation: false,
    },
  });
};

const suspend: GithubEventActionHandler = async (app, body) => {
  await app.prisma.orgs.updateMany({
    where: {
      provider_type: 'github',
      provider_id: `${body.installation.account.id}`,
    },
    data: {
      has_installation: false,
    },
  });
};

const unsuspend: GithubEventActionHandler = async (app, body) => {
  await app.prisma.orgs.updateMany({
    where: {
      provider_type: 'github',
      provider_id: `${body.installation.account.id}`,
    },
    data: {
      has_installation: true,
    },
  });
};

export default {
  created,
  deleted,
  suspend,
  unsuspend,
};
