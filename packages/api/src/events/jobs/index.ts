import botInstallationScheduled from './botInstallationScheduled';
import botScheduled from './botScheduled';
import botScheduleTriggered from './botScheduleTriggered';
import syncGithubOrgUsers from './syncGithubOrgUsers';
import syncGithubRepoUsers from './syncGithubRepoUsers';
import taskCreated from './taskCreated';
import taskScheduled from './taskScheduled';

const queues = {
  botInstallationScheduled,
  botScheduled,
  botScheduleTriggered,
  syncGithubOrgUsers,
  syncGithubRepoUsers,
  taskCreated,
  taskScheduled,
};

export default queues;
