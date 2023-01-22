import { GithubEventActionHandler } from './types';

const revoked: GithubEventActionHandler = async (app, body) => {
  // TODO: Delete refresh token for the user
  return;
};

export default {
  revoked,
};
