import { ProjectIntegrationConnectionResolvers } from '@automa/common';

import { Context } from '../types';

export const ProjectIntegrationConnection: ProjectIntegrationConnectionResolvers<Context> =
  {
    author: ({ created_by }, args, { prisma }) => {
      return prisma.users.findFirstOrThrow({
        where: {
          id: created_by,
        },
      });
    },
  };
