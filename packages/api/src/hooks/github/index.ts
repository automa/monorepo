import { GithubEventHandler, GithubEventType } from './types';

import githubAppAuthorization from './githubAppAuthorization';
import installation from './installation';
import installationRepositories from './installationRepositories';
import organization from './organization';
import pullRequest from './pullRequest';
import repository from './repository';

export const eventHandlers: {
  [type in GithubEventType]: GithubEventHandler;
} = {
  [GithubEventType.GithubAppAuthorization]: githubAppAuthorization,
  [GithubEventType.Installation]: installation,
  [GithubEventType.InstallationRepositories]: installationRepositories,
  [GithubEventType.Organization]: organization,
  [GithubEventType.PullRequest]: pullRequest,
  [GithubEventType.Repository]: repository,
};

export default eventHandlers;
