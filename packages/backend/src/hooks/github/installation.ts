import { GithubEventActionHandler } from './types';

const created: GithubEventActionHandler = async (app, body) => {
  await app.prisma.orgs.create({
    data: {
      name: body.installation.account.login,
      provider_type: 'github',
      provider_id: body.installation.account.id,
      is_user: body.installation.account.type === 'User',
      has_installation: true,
    },
  });

  return;
};

const deleted: GithubEventActionHandler = async (app, body) => {
  const org = await app.prisma.orgs.findFirst({
    where: {
      provider_type: 'github',
      provider_id: body.installation.account.id,
    },
  });

  if (!org) {
    return;
  }

  await app.prisma.orgs.update({
    where: {
      id: org.id,
    },
    data: {
      has_installation: false,
    },
  });

  return;
};

export default {
  created,
  deleted,
};
