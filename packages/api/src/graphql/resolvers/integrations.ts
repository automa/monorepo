import { OrgProjectProviderResolvers } from '@automa/common';

import { Context } from '../types';

export const OrgProjectProvider: OrgProjectProviderResolvers<Context> = {
  author: ({ created_by }, args, { prisma }) => {
    return prisma.users.findFirstOrThrow({
      where: {
        id: created_by,
      },
    });
  },
};
