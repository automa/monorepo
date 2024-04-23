import { GithubEventActionHandler } from './types';

const revoked: GithubEventActionHandler<{
  sender: {
    login: string;
    id: number;
  };
}> = async (app, body) => {
  return;
};

export default {
  revoked,
};
