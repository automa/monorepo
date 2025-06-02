import { bot, Prisma } from '@automa/prisma';

import { Context } from './types';

export const botInstall = async (
  { prisma, events }: Context,
  data: Prisma.XOR<
    Prisma.bot_installationsCreateInput,
    Prisma.bot_installationsUncheckedCreateInput
  >,
) => {
  const botInstallation = await prisma.bot_installations.create({
    data,
    include: {
      bots: true,
    },
  });

  if (botInstallation.bots.type === bot.scheduled) {
    const timestamp = Date.now();
    const jobId = `${botInstallation.bot_id}-${botInstallation.org_id}-${timestamp}`;

    await events.scheduleBotInstallation.publish(jobId, {
      botId: botInstallation.bot_id,
      orgId: botInstallation.org_id,
      timestamp,
    });
  }

  return botInstallation;
};
