import { GithubEventActionHandler } from './types';
import { addRepo } from './installationRepositories';

const created: GithubEventActionHandler = async (app, body) => {
  let org = await app.prisma.orgs.findFirst({
    where: {
      provider_type: 'github',
      provider_id: `${body.installation.account.id}`,
    },
  });

  if (!org) {
    org = await app.prisma.orgs.create({
      data: {
        name: body.installation.account.login,
        provider_type: 'github',
        provider_id: `${body.installation.account.id}`,
        is_user: body.installation.account.type === 'User',
        is_active: true,
        github_installation_id: body.installation.id,
      },
    });
  } else {
    await app.prisma.orgs.update({
      where: {
        id: org.id,
      },
      data: {
        is_active: true,
        github_installation_id: body.installation.id,
      },
    });
  }

  for (const repository of body.repositories) {
    await addRepo(app, org, repository);
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

  await app.prisma.orgs.updateMany({
    where: {
      id: org.id,
    },
    data: {
      is_active: false,
    },
  });

  await app.prisma.repos.updateMany({
    where: {
      org_id: org.id,
    },
    data: {
      is_active: false,
    },
  });
};

export default {
  created,
  deleted,
};
