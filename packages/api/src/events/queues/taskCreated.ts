import axios from 'axios';

import { TaskItemType } from '@automa/common';
import { bot_installations, bots, orgs, Prisma, repos } from '@automa/prisma';

import { logger, SeverityNumber } from '../../telemetry';

import { QueueDefinition } from '../types';

const taskCreated: QueueDefinition<{
  id: number;
}> = {
  topic: 'task-created',
  handler: async (app, { id }) => {
    logger.emit({
      severityNumber: SeverityNumber.INFO,
      body: 'Processing task created event',
      attributes: {
        id,
      },
    });

    const task = await app.prisma.tasks.findUnique({
      where: {
        id,
      },
      include: {
        task_items: true,
      },
    });

    if (!task) {
      logger.emit({
        severityNumber: SeverityNumber.WARN,
        body: 'Unable to find task for task created event',
        attributes: {
          id,
        },
      });

      return;
    }

    const repoTaskItem = task.task_items.find(
      (item) => item.type === TaskItemType.Repo,
    );
    const botTaskItem = task.task_items.find(
      (item) => item.type === TaskItemType.Bot,
    );

    let repo: repos & { orgs: orgs },
      botInstallation: bot_installations & { bots: bots & { orgs: orgs } };

    // If the task does not have a repo, select one
    if (!repoTaskItem) {
      logger.emit({
        severityNumber: SeverityNumber.INFO,
        body: 'Deciding on repo for task',
        attributes: {
          id,
        },
      });

      // Get all repos for the org
      const repos = await app.prisma.repos.findMany({
        where: {
          org_id: task.org_id,
        },
        include: {
          orgs: true,
        },
      });

      // TODO: Handle gracefully if no active repos are found
      // TODO: Use AI to select the best repo
      repo = repos[0];

      // Update the task with the selected repo
      await app.prisma.task_items.create({
        data: {
          task_id: id,
          type: 'repo',
          data: {
            repoId: repo.id,
            repoName: repo.name,
            repoOrgId: repo.orgs.id,
            repoOrgName: repo.orgs.name,
            repoOrgProviderType: repo.orgs.provider_type,
            repoOrgProviderId: repo.orgs.provider_id,
            repoProviderId: repo.provider_id,
          },
        },
      });
    } else {
      repo = await app.prisma.repos.findFirstOrThrow({
        where: {
          id: (repoTaskItem.data as Prisma.JsonObject).repoId as number,
        },
        include: {
          orgs: true,
        },
      });
    }

    // If the task does not have a bot, select one
    if (!botTaskItem) {
      logger.emit({
        severityNumber: SeverityNumber.INFO,
        body: 'Deciding on bot for task',
        attributes: {
          id,
        },
      });

      // Get all bot installations for the org
      const botInstallations = await app.prisma.bot_installations.findMany({
        where: {
          org_id: task.org_id,
        },
        include: {
          bots: {
            include: {
              orgs: true,
            },
          },
        },
      });

      // TODO: Handle gracefully if no bot installations are found
      // TODO: Use AI to select the best bot
      botInstallation = botInstallations[0];

      // Update the task with the selected bot
      await app.prisma.task_items.create({
        data: {
          task_id: id,
          type: 'bot',
          data: {
            botId: botInstallation.bots.id,
            botName: botInstallation.bots.name,
            botOrgId: botInstallation.bots.orgs.id,
            botOrgName: botInstallation.bots.orgs.name,
          },
        },
      });
    } else {
      botInstallation = await app.prisma.bot_installations.findFirstOrThrow({
        where: {
          bot_id: (botTaskItem.data as Prisma.JsonObject).botId as number,
          org_id: task.org_id,
        },
        include: {
          bots: {
            include: {
              orgs: true,
            },
          },
        },
      });
    }

    // Send webhook to bot
    return axios.post(
      botInstallation.bots.webhook_url,
      {
        task: {
          id,
          title: task.title,
        },
      },
      {
        headers: {},
      },
    );
  },
};

export default taskCreated;
