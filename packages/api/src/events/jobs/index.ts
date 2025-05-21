import scheduleBot from './scheduleBot';
import scheduleBotInstallation from './scheduleBotInstallation';
import scheduleBots from './scheduleBots';
import scheduleTask from './scheduleTask';
import sendTaskWebhook from './sendTaskWebhook';
import syncGithubOrgUsers from './syncGithubOrgUsers';
import syncGithubRepoUsers from './syncGithubRepoUsers';

const queues = {
  scheduleBotInstallation,
  scheduleBot,
  scheduleBots,
  syncGithubOrgUsers,
  syncGithubRepoUsers,
  sendTaskWebhook,
  scheduleTask,
};

export default queues;
