import extendJiraWebhooks from './extendJiraWebhooks';
import scheduleBot from './scheduleBot';
import scheduleBotInstallation from './scheduleBotInstallation';
import scheduleBots from './scheduleBots';
import scheduleTask from './scheduleTask';
import sendTaskWebhook from './sendTaskWebhook';
import syncGithubOrgUsers from './syncGithubOrgUsers';
import syncGithubRepoUsers from './syncGithubRepoUsers';

const queues = {
  extendJiraWebhooks,
  scheduleBot,
  scheduleBotInstallation,
  scheduleBots,
  scheduleTask,
  sendTaskWebhook,
  syncGithubOrgUsers,
  syncGithubRepoUsers,
};

export default queues;
