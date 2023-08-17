import { GithubEventActionHandler } from './types';

const revoked: GithubEventActionHandler<{
  sender: {
    login: string;
    id: number;
  };
}> = async (app, body) => {
  // TODO: Delete refresh token for the user
  return;
};

export default {
  revoked,
};
