import { FastifyInstance } from 'fastify';
import { AxiosInstance } from 'axios';

import { CONFIG_FILES } from '@automa/common';
import { Prisma, repos } from '@automa/prisma';

import { GithubRepository } from './types';

export const syncSettings = async (
  app: FastifyInstance,
  axios: AxiosInstance,
  repo: repos,
  repository: GithubRepository,
  headCommit?: string,
) => {
  const [settings, commit] = await Promise.all([
    readSettings(axios, repository, headCommit),
    headCommit ?? readBranchHead(axios, repository),
  ]);

  await app.prisma.repos.update({
    where: {
      id: repo.id,
    },
    data: {
      settings: settings === null ? Prisma.JsonNull : JSON.parse(settings),
      last_commit_synced: commit,
    },
  });

  // TODO: validate settings
};

const readSettings = async (
  axios: AxiosInstance,
  repository: GithubRepository,
  headCommit?: string,
) => {
  for (const file of CONFIG_FILES) {
    try {
      const { data } = await axios.get(
        `/repos/${repository.full_name}/contents/${file}`,
        headCommit
          ? {
              params: {
                ref: headCommit,
              },
            }
          : undefined,
      );

      return Buffer.from(data.content, 'base64').toString('utf-8');
    } catch (_) {}
  }

  return null;
};

const readBranchHead = async (
  axios: AxiosInstance,
  repository: GithubRepository,
) => {
  try {
    const { data } = await axios.get(
      `/repos/${repository.full_name}/branches/${repository.default_branch}`,
    );

    return data.commit.sha;
  } catch (_) {
    return null;
  }
};
