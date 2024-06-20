import { FastifyInstance } from 'fastify';

import { CauseType } from '@automa/common';
import { provider } from '@automa/prisma';

import { caller } from '../../clients/github';

import {
  GithubEventActionHandler,
  GithubInstallation,
  GithubRepository,
  GithubRepositoryMinimal,
} from './types';

import { addRepo, updateRepo } from './installationRepositories';

const created: GithubEventActionHandler<{
  installation: GithubInstallation;
  repositories: GithubRepositoryMinimal[];
}> = async (app, body) => {
  const org = await app.prisma.orgs.upsert({
    where: {
      provider_type_provider_id: {
        provider_type: provider.github,
        provider_id: `${body.installation.account.id}`,
      },
    },
    update: {
      has_installation: true,
      github_installation_id: body.installation.id,
      // TODO: Add a test for an user being converted to an org when app is uninstalled and reinstalled
      is_user: body.installation.account.type === 'User',
    },
    create: {
      name: body.installation.account.login,
      provider_type: provider.github,
      provider_id: `${body.installation.account.id}`,
      provider_name: body.installation.account.login,
      has_installation: true,
      github_installation_id: body.installation.id,
    },
  });

  const { axios } = await caller(body.installation.id);

  for (const repository of body.repositories) {
    await addRepo(
      app,
      axios,
      org,
      repository,
      CauseType.APP_INSTALLED_WITH_REPOSITORY,
    );
  }
};

const deleted: GithubEventActionHandler<{
  installation: GithubInstallation;
  repositories: GithubRepositoryMinimal[];
}> = async (app, body) => inactive(app, body.installation.account.id, true);

const suspend: GithubEventActionHandler<{
  installation: GithubInstallation;
}> = async (app, body) => inactive(app, body.installation.account.id);

const unsuspend: GithubEventActionHandler<{
  installation: GithubInstallation;
}> = async (app, body) => {
  const org = await app.prisma.orgs.update({
    where: {
      provider_type_provider_id: {
        provider_type: provider.github,
        provider_id: `${body.installation.account.id}`,
      },
    },
    data: {
      provider_name: body.installation.account.login,
      has_installation: true,
    },
  });

  const { axios, paginate } = await caller(body.installation.id);

  const pages = paginate<{ repositories: GithubRepository[] }>(
    '/installation/repositories',
  );

  for await (const data of pages) {
    for (const repository of data.repositories) {
      await updateRepo(
        app,
        axios,
        org,
        repository,
        CauseType.REPOSITORY_SYNCED_AFTER_UNSUSPENDED,
      );
    }
  }
};

const inactive = async (
  app: FastifyInstance,
  providerId: number,
  deleted = false,
) => {
  await app.prisma.orgs.update({
    where: {
      provider_type_provider_id: {
        provider_type: provider.github,
        provider_id: `${providerId}`,
      },
    },
    data: {
      has_installation: false,
      ...(deleted && {
        github_installation_id: null,
      }),
    },
  });

  await app.prisma.repos.updateMany({
    where: {
      orgs: {
        provider_type: provider.github,
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
