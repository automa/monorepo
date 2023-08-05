import { GithubEventActionHandler } from './types';

const archived: GithubEventActionHandler = async (app, body) => {
  await app.prisma.repos.updateMany({
    where: {
      provider_id: `${body.repository.id}`,
      is_archived: false,
      orgs: {
        provider_type: 'github',
        provider_id: `${body.organization.id}`,
      },
    },
    data: {
      is_archived: true,
    },
  });
};

// We are not handling the `repository.deleted` event because we will not
// recieve it at all. Instead, we handle the change with the
// `installation_repositories.removed` event.

const privatized: GithubEventActionHandler = async (app, body) => {
  await app.prisma.repos.updateMany({
    where: {
      provider_id: `${body.repository.id}`,
      is_private: false,
      orgs: {
        provider_type: 'github',
        provider_id: `${body.organization.id}`,
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
        provider_id: `${body.organization.id}`,
      },
    },
    data: {
      is_private: false,
    },
  });
};

const renamed: GithubEventActionHandler = async (app, body) => {
  await app.prisma.repos.updateMany({
    where: {
      provider_id: `${body.repository.id}`,
      orgs: {
        provider_type: 'github',
        provider_id: `${body.organization.id}`,
      },
    },
    data: {
      name: body.repository.name,
    },
  });
};

// We are not handling the `repository.transferred` event because we will not
// recieve it when the new owner doesn't have the app installed. Instead, we
// handle the change with the `installation_repositories.added` and the
// `installation_repositories.removed` events.

const unarchived: GithubEventActionHandler = async (app, body) => {
  await app.prisma.repos.updateMany({
    where: {
      provider_id: `${body.repository.id}`,
      is_archived: true,
      orgs: {
        provider_type: 'github',
        provider_id: `${body.organization.id}`,
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
  renamed,
  unarchived,
};
