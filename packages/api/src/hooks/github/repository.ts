import { GithubEventActionHandler } from './types';

const archived: GithubEventActionHandler = async (app, body) => {
  await app.prisma.repos.updateMany({
    where: {
      provider_id: `${body.repository.id}`,
      is_archived: false,
      orgs: {
        provider_type: 'github',
        provider_id: `${body.installation.account.id}`,
      },
    },
    data: {
      is_archived: true,
    },
  });
};

const privatized: GithubEventActionHandler = async (app, body) => {
  await app.prisma.repos.updateMany({
    where: {
      provider_id: `${body.repository.id}`,
      is_private: false,
      orgs: {
        provider_type: 'github',
        provider_id: `${body.installation.account.id}`,
      },
    },
    data: {
      is_private: true,
    },
  });
};

const publicized: GithubEventActionHandler = async (app, body) => {
  await app.prisma.repos.updateMany({
    where: {
      provider_id: `${body.repository.id}`,
      is_private: true,
      orgs: {
        provider_type: 'github',
        provider_id: `${body.installation.account.id}`,
      },
    },
    data: {
      is_private: false,
    },
  });
};

const unarchived: GithubEventActionHandler = async (app, body) => {
  await app.prisma.repos.updateMany({
    where: {
      provider_id: `${body.repository.id}`,
      is_archived: true,
      orgs: {
        provider_type: 'github',
        provider_id: `${body.installation.account.id}`,
      },
    },
    data: {
      is_archived: false,
    },
  });
};

export default {
  archived,
  privatized,
  publicized,
  unarchived,
};
