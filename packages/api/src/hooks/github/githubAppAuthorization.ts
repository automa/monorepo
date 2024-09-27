import { GithubEventActionHandler, GithubSender } from './types';

const revoked: GithubEventActionHandler<{
  sender: GithubSender;
}> = async (app, body) => {
  // No need to clear the sessions for the user because they will be
  // automatically logged out when they try to access github

  // Delete the refresh token for the user provider
  await app.prisma.user_providers.updateMany({
    where: {
      provider_type: 'github',
      provider_id: `${body.sender.id}`,
    },
    data: {
      refresh_token: null,
    },
  });
};

export default {
  revoked,
};
