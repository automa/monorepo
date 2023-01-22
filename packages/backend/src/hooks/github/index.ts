import { GithubEventType, GithubEventHandler } from './types';

import githubAppAuthorization from './githubAppAuthorization';
import installation from './installation';
import installationRepositories from './installationRepositories';

export const eventHandlers: {
  [type in GithubEventType]: GithubEventHandler;
} = {
  [GithubEventType.GithubAppAuthorization]: githubAppAuthorization,
  [GithubEventType.Installation]: installation,
  [GithubEventType.InstallationRepositories]: installationRepositories,
};

export default eventHandlers;
