import { GithubEventType, GithubEventHandler } from './types';

import installation from './installation';
import installationRepositories from './installationRepositories';

export const eventHandlers: {
  [type in GithubEventType]: GithubEventHandler;
} = {
  [GithubEventType.Installation]: installation,
  [GithubEventType.InstallationRepositories]: installationRepositories,
};

export default eventHandlers;
