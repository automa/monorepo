import { FastifyInstance } from 'fastify';
import { AxiosInstance } from 'axios';

import { CONFIG_FILES, CauseType } from '@automa/common';
import { validate } from '@automa/config';
import { Prisma, repos } from '@automa/prisma';

import { GithubRepository } from './types';

export const syncSettings = async (
  app: FastifyInstance,
  axios: AxiosInstance,
  repo: repos,
  repository: GithubRepository,
  cause: CauseType,
  headCommit?: string,
) => {
  const [settings, commit] = await Promise.all([
    readSettings(axios, repository, headCommit),
    headCommit ?? readBranchHead(axios, repository),
  ]);

  let errors, settingsJSON;

  if (settings) {
    try {
      settingsJSON = JSON.parse(settings);
    } catch (err) {
      errors = { deserialize: (err as Error).message };
    }
  }

  if (!errors) {
    const errs = validate(settingsJSON);

    if (errs) {
      errors = { schema: errs };
    }
  }

  await app.prisma.repos.update({
    where: {
      id: repo.id,
    },
    data: {
      last_commit_synced: commit,
      repo_settings: {
        createMany: {
          data: [
            {
              cause,
              commit,
              settings: settings === null ? Prisma.JsonNull : settingsJSON,
              // @ts-ignore
              validation_errors: errors === null ? Prisma.JsonNull : errors,
            },
          ],
        },
      },
    },
  });
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
