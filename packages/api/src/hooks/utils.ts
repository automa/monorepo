import { FastifyInstance } from 'fastify';

import { bot } from '@automa/prisma';

import { environment } from '../env';

const OPTIONS = ['bot', 'repo'];

export const getMentionUsername = () => {
  const mentionUser = ['test', 'production'].includes(environment)
    ? ''
    : environment;

  return `@automa${mentionUser}`;
};

export const getRegex = (mentionable: boolean = false) => {
  if (!mentionable) {
    return /^\/automa(\s.*)?$/;
  }

  return new RegExp(`^${getMentionUsername()}(\\s.*)?$`);
};

export const getOptions = (comment: string, regex: RegExp) => {
  const options = comment.match(regex)![1];

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

// TODO: Allow the user to not specify a bot and repo
// - If only one of them exists
// - If default bot and repo are set in the org
export const getSelectedBotAndRepo = async (
  app: FastifyInstance,
  orgId: number,
  text: string,
  regex: RegExp,
) => {
  const problems = [];

  // Get the options
  const options = getOptions(text, regex);

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
    });

    selectedRepo = repos.find((repo) => [repo.name].includes(options.repo));

    if (!selectedRepo) {
      problems.push(`Repo \`${options.repo}\` not found.`);
    } else if (selectedRepo.is_archived) {
      selectedRepo = undefined;
      problems.push(`Repo \`${options.repo}\` is archived.`);
    } else if (!selectedRepo.has_installation) {
      selectedRepo = undefined;
      problems.push(`Repo \`${options.repo}\` is not connected to Automa.`);
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
