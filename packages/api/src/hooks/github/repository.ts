import { CauseType } from '@automa/common';
import { provider } from '@automa/prisma';

import { caller } from '../../clients/github';

import {
  GithubEventActionHandler,
  GithubInstallationMinimal,
  GithubRepository,
} from './types';
import { syncSettings } from './settings';

// NOTE: User's repositories does not contain organization information.

const updateRepo =
  (
    key: 'is_archived' | 'is_private',
    value: boolean,
  ): GithubEventActionHandler<{
    installation: GithubInstallationMinimal;
    repository: GithubRepository;
  }> =>
  async (app, body) => {
    await app.prisma.repos.updateMany({
      where: {
        provider_id: `${body.repository.id}`,
        is_archived: false,
        orgs: {
          provider_type: provider.github,
          provider_id: `${body.repository.owner.id}`,
        },
      },
      data: {
        [key]: value,
      },
    });
  };

const edited: GithubEventActionHandler<{
  changes: {
    default_branch?: {
      from: string;
    };
  };
  installation: GithubInstallationMinimal;
  repository: GithubRepository;
}> = async (app, body) => {
  if (!body.changes.default_branch) {
    return;
  }

  const repo = await app.prisma.repos.findFirst({
    where: {
      provider_id: `${body.repository.id}`,
      orgs: {
        provider_type: provider.github,
        provider_id: `${body.repository.owner.id}`,
      },
    },
  });

  if (!repo) {
    return;
  }

  const { axios } = await caller(app, body.installation.id);

  return syncSettings(
    app,
    axios,
    repo,
    body.repository,
    CauseType.DEFAULT_BRANCH_CHANGED,
  );
};

// We are not handling the `repository.deleted` event because we will not
// recieve it at all. Instead, we handle the change with the
// `installation_repositories.removed` event.

const renamed: GithubEventActionHandler<{
  installation: GithubInstallationMinimal;
  repository: GithubRepository;
}> = async (app, body) => {
  await app.prisma.repos.updateMany({
    where: {
      provider_id: `${body.repository.id}`,
      orgs: {
        provider_type: provider.github,
        provider_id: `${body.repository.owner.id}`,
      },
    },
    data: {
      name: body.repository.name,
    },
  });
};

// We are not handling the `repository.transferred` event because we will not
// recieve it when the new owner doesn't have the app installed. Instead, we
// handle the change with the `installation_repositories.added` and the
// `installation_repositories.removed` events.

export default {
  archived: updateRepo('is_archived', true),
  edited,
  privatized: updateRepo('is_private', true),
  publicized: updateRepo('is_private', false),
  renamed,
  unarchived: updateRepo('is_archived', false),
};
