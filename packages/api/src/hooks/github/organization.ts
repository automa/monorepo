import {
  GithubEventActionHandler,
  GithubInstallationMinimal,
  GithubOrganization,
} from './types';

// We are not handling the `organization.deleted` event because
// we handle the change with the `installation.deleted` event.

const renamed: GithubEventActionHandler<{
  installation: GithubInstallationMinimal;
  organization: GithubOrganization;
}> = async (app, body) => {
  await app.prisma.orgs.updateMany({
    where: {
      provider_type: 'github',
      provider_id: `${body.organization.id}`,
    },
    data: {
      name: body.organization.login,
    },
  });
};

export default {
  renamed,
};
