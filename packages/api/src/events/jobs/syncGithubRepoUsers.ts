import { provider } from '@automa/prisma';

import { JobDefinition } from '../types';

import { caller } from '../../clients/github';

const syncGithubRepoUsers: JobDefinition<{
  repoId: number;
}> = {
  handler: async (app, { repoId }) => {
    const repo = await app.prisma.repos.findUnique({
      where: {
        id: repoId,
      },
      include: {
        orgs: true,
      },
    });

    if (!repo) {
      return app.log.warn(
        { repo_id: repoId },
        'Unable to find repo for syncGithubRepoUsers event',
      );
    }

    if (!repo.orgs.github_installation_id) {
      return app.log.warn(
        { repo_id: repoId },
        'Repo org does not have a github installation',
      );
    }

    const { paginate } = await caller(repo.orgs.github_installation_id);

    const pages = paginate<{ id: number }[]>(
      `/repos/${repo.orgs.provider_name}/${repo.name}/collaborators`,
    );

    const users: { id: number }[] = [];

    for await (const data of pages) {
      users.push(...data);
    }

    const dbUsers = await app.prisma.user_providers.findMany({
      where: {
        provider_type: provider.github,
        provider_id: {
          in: users.map(({ id }) => `${id}`),
        },
      },
    });

    // We insert the users into the org even though syncGithubOrgUsers is also called
    // because we need to handle outside collaborators
    await app.prisma.user_orgs.createMany({
      data: dbUsers.map(({ user_id }) => ({
        user_id,
        org_id: repo.org_id,
      })),
      skipDuplicates: true,
    });

    // TODO: Delete users that are no longer in the repo
    await app.prisma.user_repos.createMany({
      data: dbUsers.map(({ user_id }) => ({
        user_id,
        repo_id: repo.id,
      })),
      skipDuplicates: true,
    });
  },
};

export default syncGithubRepoUsers;
