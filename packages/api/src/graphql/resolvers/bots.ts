import {
  BotResolvers,
  MutationResolvers,
  PublicBotResolvers,
  QueryResolvers,
  botCreateSchema,
  publicBotFields,
  publicOrgFields,
} from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  bots: async (root, { org_id }, { userId, prisma }) => {
    // TODO: Convert the org check into a directive and/or use resolver composition, and cache this in session
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: userId,
        org_id,
      },
    });

    return prisma.bots.findMany({
      where: {
        org_id,
      },
      orderBy: {
        id: 'asc',
      },
    });
  },
  publicBots: async (root, args, { prisma }) => {
    return prisma.bots.findMany({
      where: {
        is_published: true,
      },
      orderBy: {
        id: 'asc',
      },
      select: publicBotFields,
    });
  },
  publicBot: async (root, { org_name, name }, { prisma }) => {
    return prisma.bots.findFirstOrThrow({
      where: {
        name,
        is_published: true,
        orgs: {
          name: org_name,
        },
      },
      select: publicBotFields,
    });
  },
};

export const Mutation: MutationResolvers<Context> = {
  botCreate: async (_, { org_id, input }, { userId, prisma }) => {
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: userId,
        org_id,
      },
    });

    const data = botCreateSchema.parse(input);

    return prisma.bots.create({
      data: {
        org_id,
        ...data,
      },
    });
  },
};

export const PublicBot: PublicBotResolvers<Context> = {
  org: ({ id }, args, { prisma }) => {
    return prisma.bots
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .orgs({
        select: publicOrgFields,
      });
  },
  installation: async (
    { id, org_id: botOrgId },
    { org_id },
    { userId, prisma },
  ) => {
    // TODO: This is blocking prisma from optimizing N+1 queries, caching orgs in session would fix this
    // Check if the user is a member of the given org or the bot's org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: userId,
        org_id: {
          in: [org_id, botOrgId],
        },
      },
    });

    const installations = await prisma.bots
      .findUnique({
        where: {
          id,
        },
      })
      .bot_installations({
        where: {
          org_id,
        },
        take: 1,
      });

    return installations?.[0] ?? null;
  },
};

export const Bot: BotResolvers<Context> = {
  org: ({ id }, args, { prisma }) => {
    return prisma.bots
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .orgs();
  },
};
