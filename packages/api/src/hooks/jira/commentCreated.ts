import axios from 'axios';

import { integration, task_item } from '@automa/prisma';

import { env } from '../../env';

import { AUTOMA_REGEX, getSelectedBotAndRepo } from '../utils';

import { taskCreate } from '../../db';
import { fromAdfToMarkdown, withJiraTokenRefresh } from '../../integrations';

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
  const text = body.comment.body.trim();
  const url = /^(.*)\/rest\/api\//.exec(body.comment.self)?.[1];

  if (!AUTOMA_REGEX.test(text) || !url) {
    return;
  }

  // Find the integration for the organization
  const connection = await app.prisma.integrations.findFirst({
    where: {
      type: integration.jira,
      config: {
        path: ['url'],
        equals: url,
      },
    },
    include: {
      orgs: true,
    },
  });

  // Read JSON fields
  if (
    !(
      connection?.secrets &&
      typeof connection.secrets === 'object' &&
      !Array.isArray(connection.secrets)
    ) ||
    !(
      connection?.config &&
      typeof connection.config === 'object' &&
      !Array.isArray(connection.config)
    )
  ) {
    return;
  }

  // Check if we have the refresh token
  if (!connection.secrets.refresh_token || !connection.secrets.access_token) {
    return;
  }

  let tokens = {
    access_token: connection.secrets.access_token as string,
    refresh_token: connection.secrets.refresh_token as string,
  };

  // Select the bot and repo
  const { selectedBot, selectedRepo, problems } = await getSelectedBotAndRepo(
    app,
    connection.org_id,
    text,
  );

  const reponseComment: any = { version: 1, type: 'doc', content: [] };

  // Only create the task if we have a bot and repo
  // TODO: Allow the user to not specify a bot and repo
  if (selectedBot && selectedRepo) {
    // Retrieve the issue
    const issueUrl = `${env.JIRA_APP.API_URI}/${connection.config.id}/rest/api/3/issue/${body.issue.id}`;
    let issue;

    const readIssue = (token: string) =>
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
      }>(issueUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    ({
      result: { data: issue },
      tokens: tokens,
    } = await withJiraTokenRefresh(app, connection.id, tokens, readIssue));

    // Find comment from list of comments in the issue
    const comment = issue.fields.comment.comments.find(
      (comment) => comment.id === body.comment.id,
    );

    // TODO: Check if the issue is already linked to a task

    // Find automa user using email if they exist
    // TODO: Unify this logic across the app in db/users.ts
    const automaUser = comment?.author.emailAddress
      ? await app.prisma.users.findFirst({
          where: {
            email: comment?.author.emailAddress,
          },
        })
      : null;
    const userData = !automaUser
      ? {
          integration: integration.jira,
          userId: comment?.author.accountId ?? body.comment.author.accountId,
          userName:
            comment?.author.displayName ?? body.comment.author.displayName,
          userEmail: comment?.author.emailAddress,
        }
      : {};

    const task = await taskCreate(app, {
      org_id: connection.org_id,
      title: issue.fields.summary.slice(0, 255),
      task_items: {
        create: [
          ...(issue.fields.description
            ? [
                {
                  type: task_item.message,
                  data: {
                    content: fromAdfToMarkdown(issue.fields.description),
                  },
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
            actor_user_id: automaUser?.id,
          },
          ...(selectedRepo
            ? [
                {
                  type: task_item.repo,
                  data: {
                    ...userData,
                  },
                  actor_user_id: automaUser?.id,
                  repo_id: selectedRepo.id,
                },
              ]
            : []),
          ...(selectedBot
            ? [
                {
                  type: task_item.bot,
                  data: {
                    ...userData,
                  },
                  actor_user_id: automaUser?.id,
                  bot_id: selectedBot.bots.id,
                },
              ]
            : []),
        ],
      },
    });

    const taskLink = `${env.CLIENT_URI}/${connection.orgs.name}/tasks/${task.id}`;

    reponseComment.content.push({
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
    });
  }

  // Notify the user if there were any problems
  if (problems.length) {
    reponseComment.content.push({
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'We encountered the following issues while creating the task:',
        },
      ],
    });

    reponseComment.content.push({
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
    });
  }

  // Create a comment to notify the user
  const commentUrl = `${env.JIRA_APP.API_URI}/${connection.config.id}/rest/api/3/issue/${body.issue.id}/comment`;

  await withJiraTokenRefresh(app, connection.id, tokens, (token: string) =>
    axios.post(
      commentUrl,
      {
        body: reponseComment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ),
  );

  return;
};

export default commentCreated;
