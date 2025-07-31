import { LinearClient } from '@linear/sdk';

import {
  bot_installations,
  bots,
  integration,
  orgs,
  repos,
  task_item,
} from '@automa/prisma';

import { JobDefinition } from '../types';
import { sendWebhook } from '../utils';

import { getRegex } from '../../hooks/utils';

const sendTaskWebhook: JobDefinition<{
  taskId: number;
}> = {
  handler: async (app, { taskId }) => {
    const task = await app.prisma.tasks.findUnique({
      where: {
        id: taskId,
      },
      include: {
        task_items: true,
      },
    });

    if (!task) {
      return app.log.warn(
        { task_id: taskId },
        'Unable to find task for sendTaskWebhook event',
      );
    }

    const repoTaskItem = task.task_items.find(
      (item) => item.type === task_item.repo,
    );
    const botTaskItem = task.task_items.find(
      (item) => item.type === task_item.bot,
    );
    const originTaskItem = task.task_items.find(
      (item) => item.type === task_item.origin,
    );

    let repo: repos & { orgs: orgs },
      botInstallation: bot_installations & { bots: bots & { orgs: orgs } };

    // If the task does not have a repo, select one
    if (!repoTaskItem) {
      app.log.info({ task_id: taskId }, 'Deciding on repo for task');

      // Get all repos for the org
      const repos = await app.prisma.repos.findMany({
        where: {
          org_id: task.org_id,
          is_archived: false,
          has_installation: true,
        },
        include: {
          orgs: true,
        },
      });

      // TODO: Handle gracefully if no active repos are found
      if (!repos.length) {
        return app.log.warn(
          { task_id: taskId },
          'No active repos found for task',
        );
      }

      // TODO: Old logic to default to the first repo
      // This should be probably removed in favor of erroring out
      repo = repos[0];

      // Update the task with the selected repo
      await app.prisma.task_items.create({
        data: {
          task_id: taskId,
          type: task_item.repo,
          repo_id: repo.id,
        },
      });
    } else {
      repo = await app.prisma.repos.findUniqueOrThrow({
        where: {
          id: repoTaskItem.repo_id!,
        },
        include: {
          orgs: true,
        },
      });
    }

    // If the task does not have a bot, select one
    if (!botTaskItem) {
      app.log.info({ task_id: taskId }, 'Deciding on bot for task');

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
      if (!botInstallations.length) {
        return app.log.warn(
          { task_id: taskId },
          'No active bots found for task',
        );
      }

      // TODO: Old logic to default to the first bot
      // This should be probably removed in favor of erroring out
      botInstallation = botInstallations[0];

      // Update the task with the selected bot
      await app.prisma.task_items.create({
        data: {
          task_id: taskId,
          type: task_item.bot,
          bot_id: botInstallation.bots.id,
        },
      });
    } else {
      // TODO: Handle case where bot has been uninstalled after task creation
      botInstallation = await app.prisma.bot_installations.findUniqueOrThrow({
        where: {
          bot_id_org_id: {
            bot_id: botTaskItem.bot_id!,
            org_id: task.org_id,
          },
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

    if (
      originTaskItem?.data &&
      typeof originTaskItem.data === 'object' &&
      !Array.isArray(originTaskItem.data) &&
      originTaskItem.data.integration === integration.linear &&
      originTaskItem.data.issueId
    ) {
      const connection = await app.prisma.integrations.findFirst({
        where: {
          type: integration.linear,
          org_id: task.org_id,
        },
      });

      if (
        connection?.secrets &&
        typeof connection.secrets === 'object' &&
        !Array.isArray(connection.secrets) &&
        connection.secrets.access_token
      ) {
        try {
          const client = new LinearClient({
            accessToken: connection.secrets.access_token as string,
          });

          const issue = await client.issue(
            originTaskItem.data.issueId as string,
          );
          const comments = (await issue.comments()).nodes;

          const regex = getRegex(true);

          originTaskItem.data.issueComments = (
            await Promise.all(
              comments.map(async ({ body, user, externalUser }) => ({
                body,
                userName: (await user)?.name ?? (await externalUser)?.name,
              })),
            )
          ).filter(
            ({ body, userName }) =>
              !regex.test(body) && userName && !userName.startsWith('Automa'),
          );
        } catch {}
      }
    }

    const data = {
      task: {
        id: taskId,
        token: task.token,
        title: task.title,
        items: task.task_items
          .filter(({ type }) =>
            ([task_item.message, task_item.origin] as task_item[]).includes(
              type,
            ),
          )
          .map(({ id, type, data }) => ({
            id,
            type,
            data,
          })),
      },
      repo: {
        id: repo.id,
        name: repo.name,
        is_private: repo.is_private,
      },
      org: {
        id: repo.orgs.id,
        name: repo.orgs.name,
        provider_type: repo.orgs.provider_type,
      },
    };

    return sendWebhook('task.created', `${taskId}`, botInstallation.bots, data);
  },
};

export default sendTaskWebhook;
