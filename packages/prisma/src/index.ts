import { PrismaClient } from '@prisma/client';

export * from '@prisma/client';

const prisma = (url: string, debug = false) =>
  new PrismaClient({
    log: !debug ? [] : ['query'],
    datasources: {
      db: {
        url,
      },
    },
  });

export default prisma;
