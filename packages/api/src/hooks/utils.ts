import { FastifyInstance } from 'fastify';

import { bot } from '@automa/prisma';

export const AUTOMA_REGEX = /^\/automa(\s.*)?$/;

const OPTIONS = ['bot', 'repo'];

export const getOptions = (comment: string) => {
  const options = comment.match(AUTOMA_REGEX)![1];

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

export const getSelectedBotAndRepo = async (
  app: FastifyInstance,
  orgId: number,
  text: string,
) => {
  const problems = [];

  // Get the options
  const options = getOptions(text);

  // Find and assign bot if specified
  let selectedBot;

  if (options.bot) {
    const botInstallations = await app.prisma.bot_installations.findMany({
      where: {
        org_id: orgId,
        bots: {
          type: bot.manual,
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
      problems.push(`Bot \`${options.bot}\` not found.`);
    }
  } else {
    problems.push('Bot not specified. Use `bot=name` to specify a bot.');
  }

  // Find and use the repo if selected
  let selectedRepo;

  if (options.repo) {
    const repos = await app.prisma.repos.findMany({
      where: {
        org_id: orgId,
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
      problems.push(`Repo \`${options.repo}\` not found.`);
    }
  } else {
    problems.push('Repo not specified. Use `repo=name` to specify a repo.');
  }

  return {
    selectedBot,
    selectedRepo,
    problems,
  };
};
