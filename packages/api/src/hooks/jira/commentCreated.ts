// @ts-ignore
import { convert } from 'adf-to-md';
import axios from 'axios';

import { bot, integration, task_item } from '@automa/prisma';

import { env } from '../../env';

import { AUTOMA_REGEX, getOptions } from '../utils';

import { taskCreate } from '../../db';

import { JiraEventHandler } from './types';

const commentCreated: JiraEventHandler<{
  comment: {
    id: string;
    self: string;
    body: string;
    author: {
      accountId: string;
      displayName: string;
    };
  };
  issue: {
    id: string;
  };
}> = async (app, body) => {
  const { JIRA_APP } = env;

  const text = body.comment.body.trim();
  const url = /^(.*)\/rest\/api\//.exec(body.comment.self)?.[1];

  if (!AUTOMA_REGEX.test(text) || !url) {
    return;
  }

  // Find the integration for the organization
  const connection = await app.prisma.integrations.findFirst({
    where: {
      integration_type: integration.jira,
      config: {
        path: ['url'],
        equals: url,
      },
    },
    include: {
      orgs: true,
    },
  });

  // Check if we have the refresh token
  if (
    !(
      connection?.secrets &&
      typeof connection.secrets === 'object' &&
      !Array.isArray(connection.secrets) &&
      connection.secrets.refresh_token
    ) ||
    !(
      connection?.config &&
      typeof connection.config === 'object' &&
      !Array.isArray(connection.config)
    )
  ) {
    return;
  }

  // Retrieve the issue
  const [{ data: issue }] = await Promise.all([
    axios.get<{
      id: string;
      key: string;
      fields: {
        summary: string;
        description: object | null;
        issuetype: {
          id: string;
          name: string;
        };
        project: {
          id: string;
          name: string;
          key: string;
        };
        comment: {
          comments: {
            id: string;
            author: {
              accountId: string;
              displayName: string;
              emailAddress: string;
            };
          }[];
        };
      };
    }>(
      `${JIRA_APP.API_URI}/${connection.config.id}/rest/api/3/issue/${body.issue.id}`,
      {
        headers: {
          Authorization: `Bearer ${connection.secrets.access_token}`,
        },
      },
    ),
  ]);

  // Find comment from list of comments in the issue
  const comment = issue.fields.comment.comments.find(
    (comment) => comment.id === body.comment.id,
  );

  // TODO: Check if the issue is already linked to a task

  const problems = [];

  // Get the options
  const options = getOptions(text);

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
            image_url: true,
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

    if (!selectedBot) {
      problems.push(
        `Bot \`${options.bot}\` not found. Using AI to select bot.`,
      );
    }
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

    if (!selectedRepo) {
      problems.push(
        `Repo \`${options.repo}\` not found. Using AI to select repo.`,
      );
    }
  }

  const userData = {
    integration: integration.jira,
    userId: comment?.author?.accountId ?? body.comment.author.accountId,
    userName: comment?.author?.displayName ?? body.comment.author.displayName,
    userEmail: comment?.author?.emailAddress,
  };

  const task = await taskCreate(app, {
    org_id: connection.org_id,
    title: issue.fields.summary.slice(0, 255),
    task_items: {
      create: [
        ...(issue.fields.description
          ? [
              {
                type: task_item.message,
                data: { content: convert(issue.fields.description).result },
              },
            ]
          : []),
        {
          type: task_item.origin,
          data: {
            organizationId: connection.config.id,
            organizationUrl: connection.config.url,
            organizationName: connection.config.name,
            projectId: issue.fields.project.id,
            projectKey: issue.fields.project.key,
            projectName: issue.fields.project.name,
            issuetypeId: issue.fields.issuetype.id,
            issuetypeName: issue.fields.issuetype.name,
            ...userData,
            issueId: issue.id,
            issueKey: issue.key,
            issueTitle: issue.fields.summary,
            commentId: body.comment.id,
          },
        },
        ...(selectedRepo
          ? [
              {
                type: task_item.repo,
                data: {
                  ...userData,
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
                  ...userData,
                  botId: selectedBot.bots.id,
                  botName: selectedBot.bots.name,
                  botImageUrl: selectedBot.bots.image_url,
                  botOrgId: selectedBot.bots.orgs.id,
                  botOrgName: selectedBot.bots.orgs.name,
                },
              },
            ]
          : []),
      ],
    },
  });

  const taskLink = `${env.CLIENT_URI}/${connection.orgs.name}/tasks/${task.id}`;

  const reponseComment: any = {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Created task: ' },
          {
            type: 'text',
            text: taskLink,
            marks: [
              {
                type: 'link',
                attrs: {
                  href: taskLink,
                  title: 'Automa Task',
                },
              },
            ],
          },
        ],
      },
    ],
  };

  if (problems.length) {
    reponseComment.content.push({
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'We encountered the following issues while creating the task:',
        },
        {
          type: 'bulletList',
          content: problems.map((problem) => ({
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: problem,
                  },
                ],
              },
            ],
          })),
        },
      ],
    });
  }

  // Create a comment to notify the user
  await axios.post(
    `${JIRA_APP.API_URI}/${connection.config.id}/rest/api/3/issue/${issue.id}/comment`,
    {
      body: reponseComment,
    },
    {
      headers: {
        Authorization: `Bearer ${connection.secrets.access_token}`,
      },
    },
  );

  return;
};

export default commentCreated;
