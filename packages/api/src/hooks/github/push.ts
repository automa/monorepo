import { CauseType, CONFIG_FILES } from '@automa/common';
import { provider } from '@automa/prisma';

import { caller } from '../../clients/github';

import { GithubEventActionHandler, GithubRepository } from './types';

import { syncSettings } from './settings';

const push: GithubEventActionHandler<{
  ref: string;
  before: string;
  after: string;
  repository: GithubRepository;
  forced: boolean;
  commits: {
    id: string;
    added: string[];
    removed: string[];
    modified: string[];
  }[];
}> = async (app, body) => {
  if (body.ref !== `refs/heads/${body.repository.default_branch}`) {
    return;
  }

  const repo = await app.prisma.repos.findFirst({
    where: {
      provider_id: `${body.repository.id}`,
      has_installation: true,
      orgs: {
        provider_type: provider.github,
        provider_id: `${body.repository.owner.id}`,
      },
    },
    include: {
      orgs: true,
    },
  });

  if (!repo?.orgs?.github_installation_id) {
    return;
  }

  const sync = async (cause: CauseType) => {
    const { axios } = await caller(repo.orgs.github_installation_id!);
    return syncSettings(app, axios, repo, body.repository, cause, body.after);
  };

  // If it's a force push, just read from branch because when some of those commits
  // were pushed in a different branch before, this event will not contain them.
  if (body.forced) {
    return sync(CauseType.COMMIT_FORCE_PUSHED);
  }

  // If we lost some commits and last tracked commit is not the base commit for the event
  if (body.before !== repo.last_commit_synced) {
    return sync(CauseType.COMMIT_UNKNOWN_BASE);
  }

  // If any of the files we care about were changed
  for (const commit of body.commits) {
    if (
      [...commit.added, ...commit.removed, ...commit.modified].some((file) =>
        CONFIG_FILES.includes(file),
      )
    ) {
      return sync(CauseType.COMMIT_SETTINGS_CHANGED);
    }
  }

  // If we got here, it means that the event is not relevant to us
  // but we still need to update the last tracked commit
  await app.prisma.repos.update({
    where: {
      id: repo.id,
    },
    data: {
      last_commit_synced: body.after,
    },
  });
};

export default {
  push,
};
