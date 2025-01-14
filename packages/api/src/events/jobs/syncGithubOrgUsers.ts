import { provider } from '@automa/prisma';

import { logger, SeverityNumber } from '../../telemetry';

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
      logger.emit({
        severityNumber: SeverityNumber.WARN,
        body: 'Unable to find org for syncGithubOrgUsers event',
        attributes: {
          orgId,
        },
      });

      return;
    }

    if (!org.github_installation_id) {
      logger.emit({
        severityNumber: SeverityNumber.WARN,
        body: 'Org does not have a github installation',
        attributes: {
          orgId,
        },
      });

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
