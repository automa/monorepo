import checkJiraWebhooks from './checkJiraWebhooks';
import extendJiraWebhooks from './extendJiraWebhooks';
import scheduleBot from './scheduleBot';
import scheduleBotInstallation from './scheduleBotInstallation';
import scheduleBots from './scheduleBots';
import scheduleTask from './scheduleTask';
import sendTaskWebhook from './sendTaskWebhook';
import sendWebhookProposalClosed from './sendWebhookProposalClosed';
import syncGithubOrgUsers from './syncGithubOrgUsers';
import syncGithubRepoUsers from './syncGithubRepoUsers';

const queues = {
  checkJiraWebhooks,
  extendJiraWebhooks,
  scheduleBot,
  scheduleBotInstallation,
  scheduleBots,
  scheduleTask,
  sendTaskWebhook,
  sendWebhookProposalClosed,
  syncGithubOrgUsers,
  syncGithubRepoUsers,
};

export default queues;
