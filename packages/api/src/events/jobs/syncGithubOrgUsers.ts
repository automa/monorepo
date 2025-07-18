import { provider } from '@automa/prisma';

import { JobDefinition } from '../types';

import { caller } from '../../clients/github';

const syncGithubOrgUsers: JobDefinition<{
  orgId: number;
}> = {
  handler: async (app, { orgId }) => {
    const org = await app.prisma.orgs.findUnique({
      where: {
        id: orgId,
      },
    });

    if (!org) {
      return app.log.warn(
        { org_id: orgId },
        'Unable to find org for syncGithubOrgUsers event',
      );
    }

    if (!org.github_installation_id) {
      return app.log.warn(
        { org_id: orgId },
        'Org does not have a github installation',
      );
    }

    // If the org is a user, we don't need to sync its users
    // The user will be synced when they log in
    if (org.is_user) {
      return;
    }

    const { paginate } = await caller(org.github_installation_id);

    const pages = paginate<{ id: number }[]>(
      `/orgs/${org.provider_name}/members`,
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

    // We don't remove users because they might be outside collaborators of some repos in the org
    await app.prisma.user_orgs.createMany({
      data: dbUsers.map(({ user_id }) => ({
        user_id,
        org_id: org.id,
      })),
      skipDuplicates: true,
    });
  },
};

export default syncGithubOrgUsers;
