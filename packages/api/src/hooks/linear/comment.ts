import { LinearClient } from '@linear/sdk';

import { bot, integration, task_item } from '@automa/prisma';

import { env } from '../../env';

import { taskCreate } from '../../db';

import { LinearEventActionHandler } from './types';

const automaRegex = /^\/automa(\s.*)?$/;

const OPTIONS = ['bot', 'repo'];

const create: LinearEventActionHandler<{
  url: string;
  actor: {
    id: string;
    name: string;
  };
  data: {
    id: string;
    parentId?: string;
    body: string;
    issue: {
      id: string;
      title: string;
      teamId: string;
    };
  };
  organizationId: string;
}> = async (app, body) => {
  const comment = body.data.body.trim();

  if (!automaRegex.test(comment)) {
    return;
  }

  // Find the integration for the organization
  const connection = await app.prisma.integrations.findFirst({
    where: {
      integration_type: integration.linear,
      config: {
        path: ['id'],
        equals: body.organizationId,
      },
    },
    include: {
      orgs: true,
    },
  });

  // Check if we have the access token
  if (
    !(
      connection?.secrets &&
      typeof connection.secrets === 'object' &&
      !Array.isArray(connection.secrets) &&
      connection.secrets.access_token
    )
  ) {
    return;
  }

  const client = new LinearClient({
    accessToken: connection.secrets.access_token as string,
  });

  // Retrieve the issue
  const [issue, org] = await Promise.all([
    client.issue(body.data.issue.id),
    client.organization,
  ]);

  // TODO: Check if the issue is already linked to a task
  // TODO: If there are any problems, we should notify the user

  // Get the options
  const options = getOptions(comment);

  // Find and assign bot if specified
  let selectedBot;

  if (options.bot) {
    const botInstallations = await app.prisma.bot_installations.findMany({
      where: {
        org_id: connection.org_id,
        bots: {
          type: bot.event,
        },
      },
      select: {
        id: true,
        bots: {
          select: {
            id: true,
            name: true,
            orgs: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    selectedBot = botInstallations.find((botInstallation) =>
      [
        botInstallation.bots.name,
        `${botInstallation.bots.orgs.name}/${botInstallation.bots.name}`,
      ].includes(options.bot),
    );
  }

  // Find and use the repo if selected
  let selectedRepo;

  if (options.repo) {
    const repos = await app.prisma.repos.findMany({
      where: {
        org_id: connection.org_id,
      },
      select: {
        id: true,
        name: true,
        provider_id: true,
        orgs: true,
      },
    });

    selectedRepo = repos.find((repo) => [repo.name].includes(options.repo));
  }

  // Create the task
  const task = await taskCreate(app, {
    org_id: connection.org_id,
    title: issue.title.slice(0, 255),
    task_items: {
      create: [
        ...(issue.description
          ? [
              {
                type: task_item.message,
                data: { content: issue.description },
              },
            ]
          : []),
        {
          type: task_item.origin,
          data: {
            integration: integration.linear,
            organizationId: body.organizationId,
            organizationName: org.name,
            teamId: body.data.issue.teamId,
            userId: body.actor.id,
            issueId: issue.id,
            issueIdentifier: issue.identifier,
            issueTitle: issue.title,
            commentId: body.data.id,
            parentId: body.data.parentId,
            url: body.url,
          },
        },
        ...(selectedRepo
          ? [
              {
                type: task_item.repo,
                data: {
                  repoId: selectedRepo.id,
                  repoName: selectedRepo.name,
                  repoOrgId: selectedRepo.orgs.id,
                  repoOrgName: selectedRepo.orgs.name,
                  repoOrgProviderType: selectedRepo.orgs.provider_type,
                  repoOrgProviderId: selectedRepo.orgs.provider_id,
                  repoProviderId: selectedRepo.provider_id,
                },
              },
            ]
          : []),
        ...(selectedBot
          ? [
              {
                type: task_item.bot,
                data: {
                  botId: selectedBot.bots.id,
                  botName: selectedBot.bots.name,
                  botOrgId: selectedBot.bots.orgs.id,
                  botOrgName: selectedBot.bots.orgs.name,
                },
              },
            ]
          : []),
      ],
    },
  });

  // Create a comment to notify the user
  await client.createComment({
    body: `Created task: ${env.CLIENT_URI}/${connection.orgs.name}/tasks/${task.id}`,
    issueId: body.data.issue.id,
    parentId: body.data.parentId || body.data.id,
  });

  return;
};

const getOptions = (comment: string) => {
  const options = comment.match(automaRegex)![1];

  if (!options) {
    return {};
  }

  return options
    .split(' ')
    .map((option) => option.split('='))
    .filter(([key, value]) => OPTIONS.includes(key) && value)
    .reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {} as Record<string, string>,
    );
};

export default {
  create,
};
